const Book = require('../models').Book
const Bookshelf = require('../models').Bookshelf

let createBookshelf = async (req, res) => {
    try {
        let owner = req.user.user.id

        let bookshelf = await Bookshelf.create({
            owner,
            ...req.body,
        })

        res.status(201).json({
            status: 'successful',
            data: { bookshelf },
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getBookshelves = async (req, res) => {
    try {
        let page = req.query.page || 1
        let pageSize = req.query.pageSize || 20

        let offset = (page - 1) * pageSize

        let bookshelves = await Bookshelf.findAll({
            limit: pageSize,
            offset: offset,
            attributes: ['bookshelf_id', 'bookshelf_name', 'bookshelf_type'],
        })

        res.status(200).json({
            status: 'successful',
            data: { bookshelves },
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getBookshelfById = async (req, res) => {
    try {
        let bookshelfId = req.params.id

        let bookshelf = await Bookshelf.findByPk(bookshelfId)

        if (!bookshelf) {
            return res.status(404).json({
                status: 'error',
                message: 'Bookshelf not found',
            })
        }

        res.status(200).json({
            status: 'successful',
            data: { bookshelf },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let updateBookshelf = async (req, res) => {
    try {
        let userId = req.user.user.id
        let bookshelfId = req.params.id
        let updatedData = req.body

        let bookshelf = await Bookshelf.findByPk(bookshelfId)

        if (!bookshelf) {
            return res.status(404).json({
                error: 'Bookshelf not found',
            })
        }

        if (bookshelf.owner !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not authorized to access this resource.',
            })
        }

        await bookshelf.update(updatedData)

        res.status(200).json({
            status: 'successful',
            data: { bookshelf: bookshelf },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let deleteBookshelf = async (req, res) => {
    try {
        let bookshelfId = req.params.id

        let bookshelf = await Bookshelf.findByPk(bookshelfId)

        if (!bookshelf) {
            return res.status(404).json({
                error: 'Bookshelf not found',
            })
        }

        if (bookshelf.owner !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not authorized to access this resource.',
            })
        }

        await bookshelf.destroy()

        res.status(200).json({
            status: 'successful',
            message: 'Bookshelf deleted successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getBookshelfBooks = async (req, res) => {
    try {
        let bookshelfId = req.params.id
        let page = req.query.page || 1
        let pageSize = req.query.pageSize || 20

        let offset = (page - 1) * pageSize

        let bookshelf = await Bookshelf.findByPk(bookshelfId)

        if (!bookshelf) {
            return res.status(404).json({
                status: 'error',
                message: 'Bookshelf not found',
            })
        }

        let books = await bookshelf.getBooks({
            limit: pageSize,
            offset: offset,
        })

        res.status(200).json({
            status: 'successful',
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

let addBookToBookshelf = async (req, res) => {
    try {
        let bookshelfId = req.params.id
        let bookId = req.body.book_id

        let bookshelf = await Bookshelf.findByPk(bookshelfId)

        if (!bookshelf) {
            return res.status(404).json({
                status: 'error',
                message: 'Bookshelf not found',
            })
        }

        let book = await Book.findByPk(bookId)

        if (!book) {
            return res.status(404).json({
                status: 'error',
                message: 'Book not found',
            })
        }

        await bookshelf.addBook(book)

        res.status(200).json({
            status: 'successful',
            message: 'Book added to bookshelf successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let removeBookFromBookshelf = async (req, res) => {
    try {
        let bookshelfId = req.params.id
        let bookId = req.body.book_id

        let bookshelf = await Bookshelf.findByPk(bookshelfId)

        if (!bookshelf) {
            return res.status(404).json({
                status: 'error',
                message: 'Bookshelf not found',
            })
        }

        let book = await Book.findByPk(bookId)

        if (!book) {
            return res.status(404).json({
                status: 'error',
                message: 'Book not found',
            })
        }

        await bookshelf.removeBook(book)

        res.status(200).json({
            status: 'successful',
            message: 'Book removed from bookshelf successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getMyBookshelves = async (req, res) => {
    try {
        let userId = req.user.user.id
        let page = req.query.page || 1
        let pageSize = req.query.pageSize || 20

        let offset = (page - 1) * pageSize

        let bookshelves = await Bookshelf.findAll({
            limit: pageSize,
            offset: offset,
            where: {
                owner: userId,
            },
            attributes: ['bookshelf_id', 'bookshelf_name', 'bookshelf_type'],
        })

        res.status(200).json({
            status: 'successful',
            data: { bookshelves },
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getBookshelvesByOwner = async (req, res) => {
    try {
        let userId = req.params.id
        let page = req.query.page || 1
        let pageSize = req.query.pageSize || 20

        let offset = (page - 1) * pageSize

        let bookshelves = await Bookshelf.findAll({
            limit: pageSize,
            offset: offset,
            where: {
                owner: userId,
                bookshelf_type: 'PUBLIC',
            },
            attributes: ['bookshelf_id', 'bookshelf_name'],
        })

        res.status(200).json({
            status: 'successful',
            data: { bookshelves },
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

module.exports = {
    createBookshelf,
    getBookshelves,
    getBookshelfById,
    updateBookshelf,
    deleteBookshelf,
    getBookshelfBooks,
    addBookToBookshelf,
    removeBookFromBookshelf,
    getMyBookshelves,
    getBookshelvesByOwner
}