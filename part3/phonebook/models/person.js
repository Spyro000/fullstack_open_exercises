const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to ', url)

mongoose
  .connect(url)
  .then(result => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error - ', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate : {
      validator: n => {
        return /^(?:\d{2}-\d{6,}|\d{3}-\d{5,})$/.test(n)
      }
    },
    required: true}
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
