const Book = require('../models').Book
const Bookshelf = require('../models').Bookshelf
const redisClient = require('../config/redis')

let createBookshelf = async (req, res) => {
    try {
        let owner = req.user.user.id

        let bookshelf = await Bookshelf.create({
            owner,
            ...req.body,
        })

        await redisClient.del('bookshelves:*')

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

        let cachedBookshelves = await redisClient.get(`bookshelves:${page}:${pageSize}`)

        if (cachedBookshelves) {
            return res.status(200).json({
                status: 'successful',
                data: JSON.parse(cachedBookshelves),
            })
        } else {
            let bookshelves = await Bookshelf.findAll({
                limit: pageSize,
                offset: offset,
                attributes: ['bookshelf_id', 'bookshelf_name', 'bookshelf_type', 'bookshelf_image'],
            })

            await redisClient.setEx(`bookshelves:${page}:${pageSize}`, 3600, JSON.stringify({ bookshelves }))

            res.status(200).json({
                status: 'successful',
                data: { bookshelves },
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

let getBookshelfById = async (req, res) => {
    try {
        let cachedBookshelf = await redisClient.get(`bookshelves:${req.params.id}`)

        if (cachedBookshelf) {
            return res.status(200).json({
                status: 'successful',
                data: JSON.parse(cachedBookshelf),
            })
        } else {
            let bookshelfId = req.params.id

            let bookshelf = await Bookshelf.findByPk(bookshelfId)

            if (!bookshelf) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Bookshelf not found',
                })
            }

            await redisClient.setEx(`bookshelves:${req.params.id}`, 3600, JSON.stringify({ bookshelf }))

            res.status(200).json({
                status: 'successful',
                data: { bookshelf },
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

        let cachedBooks = await redisClient.get(`bookshelves:getBookshelfBooks:${req.params.id}:${page}:${pageSize}`)

        if (cachedBooks) {
            return res.status(200).json({
                status: 'successful',
                data: JSON.parse(cachedBooks),
            })
        } else {
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

            for (let i = 0; i < books.length; i++) {
                let book = books[i]

                delete book.dataValues.BookshelfBook
            }

            await redisClient.setEx(`bookshelves:getBookshelfBooks:${req.params.id}:${page}:${pageSize}`, 3600, JSON.stringify({ length: books.length, bookshelf, books }))

            res.status(200).json({
                status: 'successful',
                data: {
                    length: books.length,
                    bookshelf: bookshelf,
                    books: books,
                },
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

        let cachedBookshelves = await redisClient.get(`bookshelves:myBookshelves:${req.user.user.id}:${page}:${pageSize}`)

        if (cachedBookshelves) {
            return res.status(200).json({
                status: 'successful',
                data: JSON.parse(cachedBookshelves),
            })
        } else {
            let bookshelves = await Bookshelf.findAll({
                limit: pageSize,
                offset: offset,
                where: {
                    owner: userId,
                },
                attributes: ['bookshelf_id', 'bookshelf_name', 'bookshelf_type', 'bookshelf_image'],
            })

            for (let i = 0; i < bookshelves.length; i++) {
                let bookshelf = bookshelves[i]

                let books = await bookshelf.getBooks({
                    limit: 5,
                    attributes: ['book_id', 'cover_page']
                })

                bookshelf.dataValues.books = books

                for (let j = 0; j < books.length; j++) {
                    let book = books[j]

                    delete book.dataValues.BookshelfBook
                }
            }

            await redisClient.setEx(`bookshelves:myBookshelves:${req.user.user.id}:${page}:${pageSize}`, 3600, JSON.stringify({ bookshelves }))

            res.status(200).json({
                status: 'successful',
                data: { bookshelves },
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

let getBookshelvesByOwner = async (req, res) => {
    try {
        let userId = req.params.id
        let page = req.query.page || 1
        let pageSize = req.query.pageSize || 20

        let offset = (page - 1) * pageSize

        let cachedBookshelves = await redisClient.get(`bookshelves:ByOwner:${req.params.id}:${page}:${pageSize}`)

        if (cachedBookshelves) {
            return res.status(200).json({
                status: 'successful',
                data: JSON.parse(cachedBookshelves),
            })
        } else {
            let bookshelves = await Bookshelf.findAll({
                limit: pageSize,
                offset: offset,
                where: {
                    owner: userId,
                    bookshelf_type: 'PUBLIC',
                },
                attributes: ['bookshelf_id', 'bookshelf_name', 'bookshelf_image'],
            })

            await redisClient.setEx(`bookshelves:ByOwner:${req.params.id}:${page}:${pageSize}`, 3600, JSON.stringify({ bookshelves }))

            res.status(200).json({
                status: 'successful',
                data: { bookshelves },
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