const express = require('express')
const userController = require('../controllers/User')
let { isAuth } = require('../middleware/utils')

const router = express.Router()

router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/me', isAuth, userController.getUserProfile)

module.exports = router