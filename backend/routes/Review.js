const express = require('express')
const reviewController = require('../controllers/Review')
let { isAuth } = require('../middleware/utils')

const router = express.Router()

router.post('/', isAuth, reviewController.createReview)
router.get('/', reviewController.getReviews)
router.get('/:id', reviewController.getReviewById)
router.put('/:id', isAuth, reviewController.updateReview)
router.delete('/:id', isAuth, reviewController.deleteReview)

module.exports = router