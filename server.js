const cors = require('cors')
const express = require('express')
const cookieParser = require("cookie-parser")
const userRoutes = require('./routes/User')
const db = require('./models')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Welcome to the bkmrkd API' })
})

app.use('/api/users', userRoutes)

app.get('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Invalid route' })
})

PORT = process.env.PORT || 5000

db.sequelize.sync().then(() => {
    console.log('Database connected')

    app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))
}).catch(err => {
    console.log('Unable to connect to the database:', err)
})