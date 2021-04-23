const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')

const recommendationsRouter = require('./controllers/recommendations')
const omdbRouter = require('./controllers/omdb')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(morgan('tiny'))
app.use(middleware.requestLogger)

app.use('/api/recommendations', recommendationsRouter)
app.use('/api/omdb', omdbRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app