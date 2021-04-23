const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('recommendations')
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.post('/:id/watchlist', async (request, response) => {
  console.log(request.params);
  const body = request.body
  User.findById(request.params.id)
    .then(user => {
      user.watchlist.push(body)

      user.save()
        .then(savedUser => response.json(savedUser))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
  // const updatedUser = await User.findByIdAndUpdate(request.params.id, body)
    // { id: request.params.id }, 
    // { $addToSet: { watchlist: [] } } // Doesn't work because object added has to be exact, the date field would be different each time so a new item would get pushed to the array

    // {_id: request.params.id, 'watchlist.toWatch': {$ne: body.toWatch}}, 
    // {$push: {
    //   watchlist: body
    // }}

  // response.json(updatedUser)
})

usersRouter.delete('/:id/watchlist/:watchlistId', async (request, response) => {
  User.findById(request.params.id)
    .then(user => {
      user.watchlist.remove(request.params.watchlistId)
      
      user.save()
      .then(res => response.json('Deleted'))
      .catch(err => res.status(400).json('Error: ' + err))
   })
   .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = usersRouter