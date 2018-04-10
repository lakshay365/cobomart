const Institute = require('mongoose').model('institute')
const User = require('mongoose').model('user')
const Ad = require('mongoose').model('ad')

function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/')
  else next()
}

module.exports = app => {
  app.get('/dashboard', loggedIn, (req, res) => {
    const data = { title: `Dashboard - ${req.user.name}`, dashboard: true }

    Institute.find({})
      .then(institutes => {
        data.institutes = institutes

        return User.findById(req.user._id)
          .populate('institute')
          .exec()
      })
      .then(user => {
        data.user = user

        return Ad.find({ user: req.user._id })
      })
      .then(ads => {
        data.ads = ads
        res.render('dashboard', data)
      })
      .catch(err => console.log(err))
  })

  app.post('/profile/update', loggedIn, (req, res) => {
    if (req.body.name && req.body.institute) {
      const updateObj = { name: req.body.name, institute: req.body.institute }

      User.findByIdAndUpdate(req.user._id, updateObj)
        .then(() => res.redirect('/dashboard'))
        .catch(err => console.log(err))
    } else {
      res.redirect('/dashboard')
    }
  })
}
