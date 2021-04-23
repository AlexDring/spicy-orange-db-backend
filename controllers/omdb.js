const omdbRouter = require('express').Router()
const fetch = require('node-fetch');
const url = process.env.OMDB_URI

omdbRouter.get('/:apiRoute', async (request, response) => {
  const { apiRoute } = request.params
  const apiResponse = await fetch(`${url}${apiRoute}`)
  const json = await apiResponse.json()
  response.json(json)
})

module.exports = omdbRouter