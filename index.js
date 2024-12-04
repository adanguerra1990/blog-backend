const express = require('express')
const morgan = require('morgan')
const config = require('./utils/config')

const app = express()

app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.status(200).send('¡Backend en funcionamiento!')
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
