const mongoose = require('mongoose')
const { Schema } = mongoose

const AdSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  negotiable: { type: Boolean, default: false },
  condition: String,
  user: { type: Schema.Types.ObjectId, ref: 'user' }
})

AdSchema.index({ title: 'text', description: 'text' })

const Ad = mongoose.model('ad', AdSchema)

module.exports = Ad
