require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models').User

let generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

let login = async (req, res) => {
    try {
        let { email, password } = req.body
        let user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(400).json({ status: 'error', message: 'User not found' })
        }

        let isMatch = await user.compare(password)

        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Incorrect password' })
        }

        let payload = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        }

        let token = generateAccessToken(payload)

        res
            .status(200)
            .cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            .json({
                status: 'success',
                data: { token },

            })
    } catch (error) {
        res
            .status(500)
            .json({ status: 'error', message: error.message })
    }
}

let signup = async (req, res) => {
    try {
        let { name, email, password, role } = req.body
        let user = await User.findOne({ where: { email } })

        if (role && !['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ status: 'error', message: 'Invalid role' });
        }

        if (user) {
            return res.status(400).json({ status: 'error', message: 'User already exists' })
        }

        user = await User.create({ name, email, password, role })

        let payload = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        }

        let token = generateAccessToken(payload)

        res
            .status(200)
            .cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            .json({
                status: 'success',
                data: { token },
            })
    } catch (error) {
        res
            .status(500)
            .json({ status: 'error', message: error.message })
    }
}

let logout = async (req, res) => {
    try {
        res.clearCookie('jwt')

        res
            .status(200)
            .json({ status: 'success', message: 'Logged out' })
    } catch (error) {
        res
            .status(500)
            .json({ status: 'error', message: error.message })
    }
}

let getUserProfile = async (req, res) => {
    try {
        let user = await User.findOne({
            where: { id: req.user.user.id },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        })

        res
            .status(200)
            .json({ status: 'success', data: { user } })
    } catch (error) {
        res
            .status(500)
            .json({ status: 'error', message: error.message })
    }
}

module.exports = { generateAccessToken, login, signup, logout, getUserProfile }