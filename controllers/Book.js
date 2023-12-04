const Book = require('../models').Book;

const checkUserRole = (req) => {
    const userRole = req.user.user.role;
    return userRole === 'ADMIN';
};

const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id; // Get the book ID from the request parameters
        const updatedData = req.body; // Get updated data from the request body

        let book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({
                error: 'Book not found',
            });
        }
        if (!checkUserRole(req)) {
            return res.status(403).json({
                error: 'Unauthorized. Admin role required.',
            });
        }

        await book.update(updatedData);

        res.status(200).json({
            status: 'successful',
            data: { book: book },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id; // Get the book ID from the request parameters

        let book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({
                error: 'Book not found',
            });
        }

        // Check if the user has the required role (ADMIN) to perform the delete
        if (!checkUserRole(req, 'ADMIN')) {
            return res.status(403).json({
                error: 'Unauthorized. Admin role required.',
            });
        }

        await book.destroy();

        res.status(200).json({
            status: 'successful',
            message: 'Book deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};

const getBooks = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page from the request query parameters
        const pageSize = 20; // Number of books per page

        const offset = (page - 1) * pageSize;

        let books = await Book.findAll({
            limit: pageSize,
            offset: offset,
        });

        res.status(200).json({
            status: "succesful",
            length: books.length,
            data: { books: books },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const bookId = req.params.id; // Get the book ID from the request parameters

        let book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({
                error: 'Book not found',
            });
        }

        res.status(200).json({
            status: 'successful',
            data: { book: book },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};


module.exports = { getBooks,deleteBook,updateBook,getBookById };
