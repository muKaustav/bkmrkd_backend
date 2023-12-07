const fs = require('fs')
const readline = require('readline')
const zlib = require('zlib')
const { promisify } = require('util')
const stream = require('stream')

const pipeline = promisify(stream.pipeline)

const Book = require('./models').Book
const { Sequelize } = require('sequelize')
const { Client } = require('@elastic/elasticsearch')
const esClient = new Client({ node: 'http://64.227.180.188:9200' })

let indexName = 'books'

const sequelize = new Sequelize({
  dialect: 'postgres',
  username: 'test',
  password: 'test',
  database: 'major',
  host: '13.233.124.62',
})

let checkConnection = async () => {
  console.log('Checking connection to ElasticSearch...')
  let isConnected = false

  while (!isConnected) {
    try {
      await esClient.cluster.health({})
      console.log('Successfully connected to ElasticSearch')
      isConnected = true
    } catch (error) {
      console.log('Connection failed, retrying in 2 seconds...')
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return true
}

let createIndex = async (index) => {
  try {
    await esClient.indices.create({ index })
    console.log(`Created index ${index}`)
  } catch (err) {
    console.error(`An error occurred while creating the index ${index}:`)
    console.error(err)
  }
}

let setBooksMapping = async () => {
  try {
    let schema = {
      title_without_series: { type: 'text' },
      book_id: { type: 'integer' },
    }

    await esClient.indices.putMapping({ index: indexName, body: { properties: schema } })

    console.log('Subtitle mapping created successfully')
  } catch (error) {
    console.log('An error occurred while setting the subtitle mapping:')
    console.error(error)
  }
}

const bulkIndexData = async (data) => {
  try {
    let body = data.flatMap((doc) => [{ index: { _index: indexName } }, doc])
    await esClient.bulk({ refresh: true, body })
  } catch (error) {
    console.log('An error occurred while indexing data:')
    console.error(error)
  }
}

async function* readLinesFromFile(filePath) {
  const fileStream = fs.createReadStream(filePath)
  const gunzip = zlib.createGunzip()
  const rl = readline.createInterface({
    input: gunzip,
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    console.log(line)
    yield line
  }
}

async function processFile(filePath, chunkSize) {
  let offset = 0
  let lines = []

  for await (const line of readLinesFromFile(filePath)) {
    const [title_without_series, author, book_description, publication_year, ratings_count, book_average_rating, cover_page, book_url, is_ebook, num_pages] = line.split(',')

    let book = await Book.create({
      title_without_series,
      author,
      book_description,
      publication_year,
      ratings_count,
      book_average_rating,
      cover_page,
      book_url,
      is_ebook,
      num_pages,
    })

    lines.push({
      title_without_series,
      book_id: book.book_id,
    })

    if (lines.length === chunkSize) {
      await bulkIndexData(lines)
      lines = []
    }

    offset++
  }

  if (lines.length > 0) {
    await bulkIndexData(lines)
  }

  console.log('Data successfully indexed')
}

(async () => {
  await sequelize.sync()

  const isElasticReady = await checkConnection()

  if (isElasticReady) {
    const elasticIndex = await esClient.indices.exists({ index: 'books' })

    if (!elasticIndex) {
      await createIndex('books')
      await setBooksMapping()
    }
  }

  await processFile('final_backend_data.csv.gz', 10)

  await sequelize.close()
})()
