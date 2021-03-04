const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/recommendations', (request, response) => {
  request.get('Content-Type')
  response.json(recommendations)
})

app.post('/api/recommendations', (request, response) => {
  const recommendation = request.body
  response.json(recommendation)
})

app.get('/api/recommendations/:id', (request, response) => {
  const id = Number(request.params.id)
  const recommendation = recommendations.find(recommendation => recommendation.id === id)
  if(recommendation) {
    response.json(recommendation)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/recommendations/:id', (request, response) => {
  const id = Number(request.params.id)
  recommendations = recommendations.filter(recommendation => recommendation.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})