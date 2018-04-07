const mongoose = require('mongoose')
const { Schema } = mongoose

// For using mongoDB's geoNear feature
const PointSchema = new Schema({
  coordinates: { type: [Number], index: '2dsphere' },
  type: { type: String, default: 'Point' }
})

const InstituteSchema = new Schema({
  name: { type: String, required: true },
  abbrevation: String,
  address: { type: String, required: true },
  geometry: PointSchema
})

const Institute = mongoose.model('institute', InstituteSchema)

module.exports = Institute
