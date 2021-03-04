require('dotenv').config()
const express = require('express')
const app = express()
const Recommendation = require('./models/recommendations')
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/recommendations', (request, response) => {
  Recommendation.find({}).then(recommendations => {
    request.get('Content-Type')
    response.json(recommendations)
  })
})

app.post('/api/recommendations', (request, response) => {
  const body = request.body
  console.log(body);
  if(body.Title === undefined) {
    return response.status(400).json({ error: 'Title missing' })
  }

  const recommendation = new Recommendation({
    Title: body.Title,
    Year: body.Year,
    Rated: body.Rated,
    Released: body.Released,
    Runtime: body.Runtime,
    Genre: body.Genre,
    Director: body.Director,
    Writer: body.Writer,
    Actors: body.Actors,
    Plot: body.Plot,
    Language: body.Language,
    Country: body.Country,
    Awards: body.Awards,
    Poster: body.Poster,
    Ratings: [{ Source: body.Ratings.Source, Value: body.Ratings.Value }],
    Metascore: body.Metascore,
    imdbRating: body.imdbRating,
    imdbVotes: body.imdbVotes,
    imdbID: body.imdbID,
    Type: body.Type,
    DVD: body.DVD,
    BoxOffice: body.BoxOffice,
    Production: body.Production,
    Website: body.Website,
    Response: body.Response,
    dateAdded: body.dateAdded,
    rottenGas: [{ score: body.rottenGas.score, user: body.rottenGas.user }],
  })
  console.log(recommendation);
  recommendation.save().then(savedRecommendation => {
    response.json(savedRecommendation)
  })
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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})