const express = require('express')
const morgan = require('morgan')
const itemsRoute = require('./routes/items.route')

const app = express()

app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true, }))

app.use('/api', itemsRoute)

module.exports = app