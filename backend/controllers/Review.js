const Review = require('../models').Review
const User = require('../models').User
const redisClient = require('../config/redis')

let roundToHalf = (value) => {
    let roundedValue = Math.round(value * 2) / 2

    return parseFloat(roundedValue.toFixed(1))
}

let createReview = async (req, res) => {
    try {
        let isExistingReview = await Review.findOne({
            where: {
                userId: req.user.user.id,
                bookId: req.body.bookId,
            },
        })

        if (isExistingReview) {
            return res.status(400).json({
                status: 'error',
                message: 'User has already reviewed this book',
            })
        }

        let review = await Review.create({
            userId: req.user.user.id,
            bookId: req.body.bookId,
            rating: roundToHalf(req.body.rating),
            content: req.body.content,
        })

        res.status(201).json({
            status: 'success',
            data: { review },
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getReviews = async (req, res) => {
    try {
        let page = req.query.page || 1
        let pageSize = req.query.pageSize || 10

        let offset = (page - 1) * pageSize

        let cachedReview = await redisClient.get(`reviews:${page}:${pageSize}`)

        if (cachedReview) {
            return res.status(200).json({
                status: "successful",
                length: JSON.parse(cachedReview).reviews.length,
                data: JSON.parse(cachedReview)
            })
        } else {
            let reviews = await Review.findAll({
                limit: pageSize,
                offset: offset,
                attributes: ['id', 'rating', 'content', 'createdAt', 'userId', 'bookId'],
            })

            await redisClient.setEx(`reviews:${page}:${pageSize}`, 3600, JSON.stringify({ reviews }))

            res.status(200).json({
                status: 'successful',
                length: reviews.length,
                data: { reviews },
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

let getReviewById = async (req, res) => {
    try {
        let reviewId = req.params.id

        let cachedReview = await redisClient.get(`getReviewById:${req.params.id}`)

        if (cachedReview) {
            return res.status(200).json({
                status: "successful",
                data: JSON.parse(cachedReview)
            })
        } else {
            let review = await Review.findByPk(reviewId)

            if (!review) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Review not found',
                })
            }

            await redisClient.setEx(`getReviewById:${req.params.id}`, 3600, JSON.stringify({ review }))

            res.status(200).json({
                status: 'successful',
                data: { review },
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

let updateReview = async (req, res) => {
    try {
        let reviewId = req.params.id

        let review = await Review.findByPk(reviewId)

        if (!review) {
            return res.status(404).json({
                status: 'error',
                message: 'Review not found',
            })
        }

        review = await review.update({
            rating: roundToHalf(req.body.rating) || review.rating,
            content: req.body.content || review.content,
        })

        res.status(200).json({
            status: 'success',
            data: { review },
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let deleteReview = async (req, res) => {
    try {
        let reviewId = req.params.id

        let review = await Review.findByPk(reviewId)

        if (!review) {
            return res.status(404).json({
                status: 'error',
                message: 'Review not found',
            })
        }

        await review.destroy()

        res.status(200).json({
            status: 'success',
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

let getReviewsOfBook = async (req, res) => {
    try {
        let book_id = req.params.id

        let cachedReview = await redisClient.get(`reviews:book:${req.params.id}`)

        if (cachedReview) {
            return res.status(200).json({
                status: "successful",
                length: JSON.parse(cachedReview).reviews.length,
                data: JSON.parse(cachedReview)
            })
        } else {
            let reviews = await Review.findAll({
                where: {
                    bookId: book_id,
                },
                attributes: ['id', 'rating', 'content', 'createdAt', 'userId', 'bookId'],
            })

            for (let i = 0; i < reviews.length; i++) {
                let review = reviews[i]

                let user = await User.findByPk(review.userId, {
                    attributes: ['id', 'name'],
                })

                review.dataValues.user = user
                delete review.dataValues.userId
            }

            res.status(200).json({
                status: 'successful',
                length: reviews.length,
                data: { reviews },
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
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsOfBook,
}