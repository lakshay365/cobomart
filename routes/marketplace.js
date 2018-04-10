const Ad = require('mongoose').model('ad')

function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/login')
  else next()
}

module.exports = app => {
  app.get('/marketplace', (req, res) => {
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
      .exec()
      .then(ads => {
        res.render('marketplace', {
          title: 'Marketplace - Cobomart',
          ads: ads,
          user: req.user
        })
      })
      .catch(err => console.log(err))
  })

  app.get('/marketplace/:id', loggedIn, (req, res) => {
    Ad.findById(req.params.id)
      .populate('user')
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
