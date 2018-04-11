const mongoose = require('mongoose')
const Ad = mongoose.model('ad')
const User = mongoose.model('user')
const Institute = mongoose.model('institute')

function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/login')
  else next()
}

module.exports = app => {
  app.get('/marketplace', async function(req, res) {
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

    let renderQueryPrice = false

    if (req.query.queryPrice) {
      query.price.$gte = parseFloat(req.query.minPrice) || 0
      query.price.$lte =
        parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER

      renderQueryPrice = true
    } else {
      query.price.$gte = 0
      query.price.$lte = Number.MAX_SAFE_INTEGER
    }

    data.include = req.query.include

    if (data.include) data.maxDistance = 50

    if (req.query.maxDistance) data.maxDistance = req.query.maxDistance

    let institutesIds = []

    const nearCondition =
      req.user &&
      req.user.institute &&
      req.query.include === 'on' &&
      req.query.maxDistance

    if (nearCondition) {
      const currentUser = await User.findById(req.user._id)
        .populate('institute')
        .exec()

      const point = currentUser.institute.geometry

      institutesIds = await Institute.aggregate([
        {
          $geoNear: {
            near: point,
            distanceField: 'distance',
            maxDistance: parseFloat(data.maxDistance) * 1000,
            spherical: true
          }
        }
      ]).then(institutes =>
        institutes.map(institute => institute._id.toString())
      )
    }

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
        if (nearCondition) {
          return ads.filter(ad =>
            institutesIds.includes(ad.user.institute._id.toString())
          )
        } else if (req.user && req.user.institute && data.include !== 'on') {
          return ads.filter(ad =>
            ad.user.institute._id.equals(req.user.institute)
          )
        } else {
          return ads
        }
      })
      .then(ads => {
        data.ads = ads

        return ads.map(ad => ad._id)
      })
      .then(ids => {
        query._id = { $in: ids }

        return Ad.find(query)
          .sort({ price: 1 })
          .limit(1)
      })
      .then(ads => {
        data.minPrice = renderQueryPrice
          ? req.query.minPrice
          : (ads[0] && ads[0].price) || 0

        return Ad.find(query)
          .sort({ price: -1 })
          .limit(1)
      })
      .then(ads => {
        data.maxPrice = renderQueryPrice
          ? req.query.maxPrice
          : (ads[0] && ads[0].price) || 0

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
