const logger = require('./logger')

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

module.exports = {
  unknownEndpoint,
  errorHandler,
}
