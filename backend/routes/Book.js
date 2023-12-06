const express = require('express')
const bookController = require('../controllers/Book')
let { isAdmin } = require('../middleware/utils')

const router = express.Router()

router.post('/', isAdmin, bookController.createBook)
router.get('/', bookController.getBooks)
router.get('/search',bookController.searchBook)
router.get('/:id', bookController.getBookById)
router.put('/:id', isAdmin, bookController.updateBook)
router.delete('/:id', isAdmin, bookController.deleteBook)

module.exports = router