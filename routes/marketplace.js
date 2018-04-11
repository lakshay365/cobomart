const mongoose = require('mongoose')
const Ad = mongoose.model('ad')
const User = mongoose.model('user')

function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/login')
  else next()
}

module.exports = app => {
  app.get('/marketplace', (req, res) => {
    const query = { price: {} }
    const data = {
      title: 'Marketplace - Cobomart',
      user: req.user,
      marketplace: true
    }

    if (req.query.q) {
      data.q = req.query.q
      query.$text = { $search: req.query.q }
    }

    query.price.$gte = req.query.minPrice || 0
    query.price.$lte = req.query.maxPrice || Number.MAX_SAFE_INTEGER

    data.include = req.query.include

    if (req.query.maxDistance) data.maxDistance = req.query.maxDistance

    Ad.find(query)
      .populate({
        path: 'user',
        select: 'name institute',
        populate: {
          path: 'institute',
          select: 'name',
          model: 'institute'
        }
      })
      .sort('-date')
      .exec()
      .then(ads => {
        if (req.user && !data.include) {
          return ads.filter(ad =>
            ad.user.institute._id.equals(req.user.institute)
          )
        } else {
          return ads
        }
      })
      .then(ads => {
        data.ads = ads

        return Ad.find(query)
          .sort({ price: 1 })
          .limit(1)
      })
      .then(ads => {
        data.minPrice = ads[0].price

        return Ad.find(query)
          .sort({ price: -1 })
          .limit(1)
      })
      .then(ads => {
        data.maxPrice = ads[0].price

        res.render('marketplace', data)
      })
      .catch(err => console.log(err))
  })

  app.get('/marketplace/:id', loggedIn, (req, res) => {
    Ad.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email institute',
        populate: {
          path: 'institute',
          model: 'institute',
          select: 'name address'
        }
      })
      .exec()
      .then(ad => {
        res.render('advertisement', {
          title: `${ad.title} - Cobomart`,
          ad: ad,
          user: req.user
        })
      })
      .catch(err => console.log(err))
  })
}
