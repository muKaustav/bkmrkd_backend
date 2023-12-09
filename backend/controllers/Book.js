const axios = require('axios')
const Book = require('../models').Book
const redisClient = require('../config/redis')

let createBook = async (req, res) => {
    try {
        let book = await Book.create(req.body)

        await redisClient.del('books:*')

        let title_without_series = book.title_without_series

        let data = JSON.stringify({
            "title_without_series": title_without_series.toLowerCase(),
            "book_id": book.book_id
        })

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.ES_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }

        let response = await axios.request(config)

        if (response.status === 201) {
            res.status(201).json({
                status: 'successful',
                data: { book },
            })
        } else {
            res.status(response.status).json({
                status: 'error',
                message: 'Elasticsearch error',
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getBooks = async (req, res) => {
    try {
        let page = req.query.page || 1
        let pageSize = req.query.pageSize || 20

        let offset = (page - 1) * pageSize

        let cachedBooks = await redisClient.get(`books:${page}:${pageSize}`)

        if (cachedBooks) {
            return res.status(200).json({
                status: "succesful",
                length: JSON.parse(cachedBooks).books.length,
                data: JSON.parse(cachedBooks)
            })
        } else {

            let books = await Book.findAll({
                limit: pageSize,
                offset: offset,
                attributes: ['book_id', 'book_average_rating', 'cover_page'],
            })

            await redisClient.setEx(`books:${page}:${pageSize}`, 3600, JSON.stringify({ books }))

            res.status(200).json({
                status: "succesful",
                length: books.length,
                data: { books },
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getBookById = async (req, res) => {
    try {
        let cachedBook = await redisClient.get(`books:${req.params.id}`)

        if (cachedBook) {
            return res.status(200).json({
                status: "successful",
                data: JSON.parse(cachedBook)
            })
        } else {
            let bookId = req.params.id

            let book = await Book.findByPk(bookId)

            if (!book) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Book not found',
                })
            }

            await redisClient.setEx(`books:${req.params.id}`, 3600, JSON.stringify({ book }))

            res.status(200).json({
                status: 'successful',
                data: { book },
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let updateBook = async (req, res) => {
    try {
        const bookId = req.params.id
        const updatedData = req.body

        let book = await Book.findByPk(bookId)

        if (!book) {
            return res.status(404).json({
                error: 'Book not found',
            })
        }

        await book.update(updatedData)

        res.status(200).json({
            status: 'successful',
            data: { book: book },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id

        let book = await Book.findByPk(bookId)

        if (!book) {
            return res.status(404).json({
                error: 'Book not found',
            })
        }

        await book.destroy()

        res.status(200).json({
            status: 'successful',
            message: 'Book deleted successfully',
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let searchBook = async (req, res) => {
    try {
        let cachedSearch = await redisClient.get(`books:search:${req.query.q}`)

        if (cachedSearch) {
            return res.status(200).json({
                status: "successful",
                data: JSON.parse(cachedSearch)
            })
        } else {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: process.env.ES_URL + "?search=" + req.query.q,
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            let response = await axios.request(config)

            if (response.status === 200) {
                await redisClient.setEx(`books:search:${req.query.q}`, 3600, JSON.stringify(response.data.data))

                res.status(200).json({
                    status: 'successful',
                    data: response.data.data,
                })
            }
        }
    } catch (error) {
        console.error('Error:', error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    searchBook
}
