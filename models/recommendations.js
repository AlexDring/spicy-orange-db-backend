const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const ratingsSchema = new mongoose.Schema({ Source: String, Value: String })

  const recommendationSchema = new mongoose.Schema({
    Title: String,
    Year: String,
    Rated: String,
    Released: String,
    Runtime: String,
    Genre: String,
    Director: String,
    Writer: String,
    Actors: String,
    Plot: String,
    Language: String,
    Country: String,
    Awards: String,
    Poster: String,
    Ratings: [ratingsSchema],
    Metascore: String,
    imdbRating: String,
    imdbVotes: String,
    imdbID: String,
    Type: String,
    DVD: String,
    BoxOffice: String,
    Production: String,
    Website: String,
    Response: String,
    dateAdded: String,
    rottenGas: [{ score: String, user: String }],
  })


  recommendationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Recommendation', recommendationSchema)