const recommendationsRouter = require('express').Router()
const Recommendation = require('../models/recommendation')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

recommendationsRouter.get('/', (request, response) => {
  Recommendation.find({}).then(recommendations => {
    request.get('Content-Type')
    response.json(recommendations)
  })
})

recommendationsRouter.get('/:id', (request, response, next) => {
  Recommendation.findById(request.params.id).populate('user', { username: 1, name: 1 })
  .then(recommendation => {
    if(recommendation) {
      console.log(recommendation);
      response.json(recommendation)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

const getTokenFrom = request => { // The helper function getTokenFrom isolates the token from the authorization header. 
  // console.log('request', request);
  console.log(request);
  const authorization = request.get('authorization')
  console.log(authorization)

  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    console.log(authorization.substring(7));
    return authorization.substring(7)
  }
  return null
}

recommendationsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET) // The validity of the token is checked with jwt.verify. The method also decodes the token, or returns the Object which the token was based on:
  // The object decoded from the token contains the username and id fields, which tells the server who made the request.
  if(!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' }) // If there is no token, or the object decoded from the token does not contain the user's identity (decodedToken.id is undefined), error status code 401 unauthorized is returned and the reason for the failure is explained in the response body.
  }

  const user = await User.findById(decodedToken.id)
  // const user = await User.findById(body.userId)

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
    Ratings: body.Ratings,
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
    rottenGas: body.rottenGas,
    user: user._id
  })

  const savedRecommendation = await recommendation.save()
  console.log('savedRecommendation', savedRecommendation);
  
  user.recommendations = user.recommendations.concat(savedRecommendation._id)
  await user.save()
  console.log('user', user);

  response.json(savedRecommendation)
})

recommendationsRouter.put('/:id/rottengas', (request, response) => {
  console.log(request.body);
  Recommendation.findByIdAndUpdate(request.params.id, 
    { $push: { "rottenGas": request.body } }, 
    { upsert: true, new: true })
    .then(recommendation => {
      response.json(recommendation)
      console.log(recommendation);
  }).catch(error => 
    console.log(error)) 
})

recommendationsRouter.put('/:id/rottengas/:voteid', (request, response) => {
  console.log(request.body);
  console.log(request.params.id, request.params.voteid);

  Recommendation.findOneAndUpdate(
  { "_id": request.params.id, "rottenGas._id": request.params.voteid },
  { $set: { "rottenGas.$.score": request.body.score, "rottenGas.$.review": request.body.review } },
  { returnOriginal: false })
  .then(recommendation => {
      console.log(recommendation);
      response.json(recommendation)
    }).catch(error => console.log(error))
  })

recommendationsRouter.delete('/:id/rottengas/:voteId', async (request, response) => {
  console.log(request.params.id);
  let recommendation = await Recommendation.findById(request.params.id)
  console.log(recommendation);
  recommendation.rottenGas.remove(request.params.voteId)
  await recommendation.save()
  response.status(201).end()
})

recommendationsRouter.delete('/:id', async (request, response) => {
  const mediaId = request.params.id
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' }) 
  }

  const user = await User.findById(decodedToken.id)
  const recommendation = await Recommendation.findById(mediaId)

  if(user._id.toString() === recommendation.user.toString()) {
    await Recommendation.findByIdAndRemove(mediaId)
    user.recommendations.remove(mediaId)
    await user.save()
    response.status(204).end()
  } else {
    console.log('No');
    return response.status(401).json({ error: 'Can\'t delete an item that\'s been reviewed, added to a watchlist or marked as watched.' })
  }
})

recommendationsRouter.post('/:id/watched', (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  console.log(decodedToken);
  if(!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' }) 
  }

  User.findById(decodedToken.id)
    .then(user => {
      console.log(user);
      user.watched.push(request.params.id)
      user.save()
      .then(res => response.json(res))
      .catch(err => response.status(400).json('Error: ' + err))
    })
    .catch(err => response.status(400).json('Error: ' + err))
})

recommendationsRouter.delete('/:id/remove-watched', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' }) 
  }

  const user = await User.findById(decodedToken.id)
  user.watched.remove(request.params.id)

  await user.save()
  response.status(204).end()
})

module.exports = recommendationsRouter