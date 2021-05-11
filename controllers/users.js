const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('recommendations watchlist.toWatch') // Write a populate thing!!2 on Typora
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  console.log(user);
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

usersRouter.get('/:id/watchlist', async (request, response) => {
  const user = await User.findById(request.params.id).populate('recommendations watchlist.toWatch') 
  response.json(user)
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
})

usersRouter.delete('/:id/watchlist/:watchlistId', async (request, response) => {
  User.findById(request.params.id)
    .then(user => {
      user.watchlist.remove(request.params.watchlistId)
      
      user.save()
      .then(res => response.json(res))
      .catch(err => res.status(400).json('Error: ' + err))
   })
   .catch(err => res.status(400).json('Error: ' + err))
})

// usersRouter.post('/:id/mark-as-watched', async (request, response) => {
//   console.log(request.params);
//   const body = request.body
//   User.findById(request.params.id)
//     .then(user => {
//       user.watched.push(body)

//       user.save()
//         .then(savedUser => response.json(savedUser))
//         .catch(err => res.status(400).json('Error: ' + err))
//     })
//     .catch(err => res.status(400).json('Error: ' + err))
// })
usersRouter.post('/:id/:mediaId/mark-as-watched', async (request, response) => {
  const user = request.params.id
  const media = request.params.mediaId
  User.findById(user).then(user => {
      user.watchlist.push(media)
      console.log(user);
      user.save()
    })
})

module.exports = usersRouter