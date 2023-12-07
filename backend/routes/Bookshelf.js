const express = require('express')
const bookshelfController = require('../controllers/Bookshelf')
let { isAuth } = require('../middleware/utils')

const router = express.Router()

router.get('/owner', bookshelfController.getMyBookshelves)
router.get('/owner/:id', bookshelfController.getBookshelvesByOwner)

router.post('/', isAuth, bookshelfController.createBookshelf)
router.get('/', bookshelfController.getBookshelves)
router.get('/:id', bookshelfController.getBookshelfById)
router.put('/:id', isAuth, bookshelfController.updateBookshelf)
router.delete('/:id', isAuth, bookshelfController.deleteBookshelf)

router.get('/:id/books', bookshelfController.getBookshelfBooks)
router.post('/:id/add', isAuth, bookshelfController.addBookToBookshelf)
router.post('/:id/remove', isAuth, bookshelfController.removeBookFromBookshelf)

module.exports = router
