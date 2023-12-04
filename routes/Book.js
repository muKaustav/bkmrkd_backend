const express = require('express')
const bookController = require('../controllers/Book')
let { isAuth } = require('../middleware/isAuth')

const router = express.Router()

router.get('/getBook', bookController.getBooks)


module.exports = router