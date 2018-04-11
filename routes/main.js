const Ad = require('mongoose').model('ad')

function alreadyLoggedIn(req, res, next) {
  if (req.user) res.redirect('/')
  else next()
}

module.exports = app => {
  app.get('/', (req, res) => {
    const data = {
      title: 'Cobomart - Buy and Sell books!',
      user: req.user
    }

    const query = {}

    Ad.find({})
      .lean()
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
        if (req.user && req.user.institute && !data.include) {
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
        data.minPrice = (ads[0] && ads[0].price) || 0

        return Ad.find(query)
          .sort({ price: -1 })
          .limit(1)
      })
      .then(ads => {
        data.maxPrice = (ads[0] && ads[0].price) || 0

        res.render('home', data)
      })
      .catch(err => console.log(err))
  })

  app.get('/login', alreadyLoggedIn, (req, res) => {
    res.render('login', { title: 'Log In' })
  })

  app.get('/logout', (req, res) => {
    if (req.user) req.logout()
    res.redirect('/')
  })

  app.get('/user', (req, res) => {
    if (req.user) res.send(req.user.name)
    else res.send('No user has been logged in.')
  })
}
