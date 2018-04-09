const Ad = require('../models/ad')
const User = require('../models/user')

function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/login')
  else next()
}

module.exports = app => {
  app.get('/submit', loggedIn, (req, res) => {
    res.render('submit', {
      title: 'Cobomart - Submit Advertisement',
      user: req.user,
      hidePostAdButton: true
    })
  })

  app.post('/submit', loggedIn, (req, res) => {
    const ad = new Ad({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      negotiable: req.body.negotiable === 'on',
      condition: req.body.condition,
      user: req.user._id
    })

    ad
      .save()
      .then(ad => res.redirect(`/marketplace/${ad._id}`))
      .catch(err => console.log(err))
  })
}
