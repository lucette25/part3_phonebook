const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to', url)


mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return ((/\d{2}-\d+/.test(v) || /\d{3}-\d+/.test(v)) && /^[^-]*-[^-]*$/.test(v)) || /^[^-]*$/.test(v)
      },
      message: ' not a valid phone number!'
    },
    required: [true, 'User phone number required']

  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    //In order to use string methodes to filter
    returnedObject.name = `${returnedObject.name}`
    returnedObject.number = `${returnedObject.number}`

    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
