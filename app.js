const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const morgan = require('morgan')
const blogRouter = require('./controllers/blogs')
const { unknownEndpoint, errorHandler } = require('./utils/middleware')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)

logger.info('Conectando...', config.MONGODB_URI)

const url = process.env.MONGODB_URI

logger.info('Conectando...', url)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Conctado a MongoDB')
  })
  .catch((error) => {
    logger.info('Error al conectar con MongoDB', error)
  })

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.status(200).send('¡Backend en funcionamiento!')
})

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
