const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Express Server!</h1><a href="/api/users">Click here check API</a>');
});

app.use('/api/users/', userRoutes)

module.exports = app