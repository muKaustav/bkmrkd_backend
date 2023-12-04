const Book = require('../models').Book

let getBooks = async (req, res) => {
    try {
        let page = req.query.page || 1
        let pageSize = req.query.pageSize || 20

        let offset = (page - 1) * pageSize

        let books = await Book.findAll({
            limit: pageSize,
            offset: offset,
            attributes: ['book_id', 'book_average_rating', 'cover_page'],
        })

        res.status(200).json({
            status: "succesful",
            length: books.length,
            data: { books },
        })
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
        let bookId = req.params.id

        let book = await Book.findByPk(bookId)

        if (!book) {
            return res.status(404).json({
                status: 'error',
                message: 'Book not found',
            })
        }

        res.status(200).json({
            status: 'successful',
            data: { book },
        })
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

module.exports = { getBooks, deleteBook, updateBook, getBookById }
