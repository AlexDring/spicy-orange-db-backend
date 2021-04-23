require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const OMDB_URI = process.env.OMDB_URI

module.exports = {
  PORT,
  MONGODB_URI,
  OMDB_URI
}