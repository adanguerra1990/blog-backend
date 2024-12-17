const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Mal Formato id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)
  if (user) {
    request.user = user
  } else {
    return response.status(401).json({ error: 'User not found' })
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
