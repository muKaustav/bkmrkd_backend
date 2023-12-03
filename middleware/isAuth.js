require('dotenv').config()
const jwt = require('jsonwebtoken')

let isAuth = (req, res, next) => {
    let token = req.cookies.jwt

    if (!token) {
        return res.status(401).json({
            status: false,
            errors: {
                message: "You need to sign in to proceed.",
                code: "NOT_SIGNEDIN"
            }
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: false,
                errors: {
                    message: "You are not authorized to access this resource.",
                    code: "NOT_AUTHORIZED"
                }
            })
        }

        req.user = user

        return next()
    })
}

module.exports = { isAuth }