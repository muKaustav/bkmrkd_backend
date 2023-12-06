const cors = require('cors')
const express = require('express')
const { Client } = require('@elastic/elasticsearch');
const {checkConnection,setBooksMapping,createIndex} = require('./elastic')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const elasticUrl = 'http://elasticsearch:9200';
let esClient = new Client({ node: elasticUrl });

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Welcome to the bkmrkd API' })
})

app.get('/:search', async (req,res) => {
    let searchTerm = req.params.search;

    let query = {
        "query": {
          "bool": {
            "must": [
              {
                "multi_match": {
                  "type": "best_fields",
                  "query": `${searchTerm}`,
                  "lenient": true
                }
              }
            ],
            "filter": [],
            "should": [],
            "must_not": []
          }
        },
      }
    
    let response = await esClient.search({
        index: "books",
        body: query
    })

    if (response.hits.total.value > 0) {
      let results = response.hits.total.value

      let values = response.hits.hits.map((hit) => {
        return {
          id: hit._id,
          title_without_series: hit._source.title_without_series,
          book_id: hit._source.book_id,
          score: hit._score
        }
      })

      res.status(200).json({
          status: 'successful',
          data: {
            total_results: results,
            books: values
          }   
      })
    } else {
      res.status(404).json({
        status: 'successful',
        message: 'No books found.'   
    })
    }
})

app.get('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Invalid route' })
})

PORT = process.env.PORT || 5001

app.listen(PORT, async () => {
  const isElasticReady = await checkConnection()

  if (isElasticReady) {

    const elasticIndex = await esClient.indices.exists({ index: 'books' })

    if (!elasticIndex.body) {
      await createIndex('books')
      await setBooksMapping()
    }}
  console.log(`Server running on port ${PORT}`);
});