const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, 'username is required'],
    unique: true,
    minlength: [3, 'username must be at least 3 characters'],
  },
  name: {
    type: String,
    require: false,
  },
  passwordHash: {
    type: String,
    require: [true, 'password is required'],
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User