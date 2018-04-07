const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  name: { type: String, required: true },
  provider: String,
  providerId: String,
  email: String,
  instituteId: { type: Schema.Types.ObjectId, ref: 'institute' }
})

const User = mongoose.model('user', UserSchema)

module.exports = User
