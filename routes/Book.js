const express = require('express')
const bookController = require('../controllers/Book')
let { isAdmin } = require('../middleware/utils')

const router = express.Router()

router.get('/', bookController.getBooks)
router.get('/:id', bookController.getBookById)
router.put('/:id', isAdmin, bookController.updateBook)
router.delete('/:id', isAdmin, bookController.deleteBook)

module.exports = router