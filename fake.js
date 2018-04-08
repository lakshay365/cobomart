const passport = require('passport')
const CustomStrategy = require('passport-custom').Strategy
const User = require('mongoose').model('user')

module.exports = app => {
  passport.use(
    'custom',
    new CustomStrategy((req, done) => {
      User.findById(req.body.id)
        .then(user => done(null, user))
        .catch(err => done(err))
    })
  )

  app.get('/fake_login', (req, res) => {
    User.find({ provider: 'faker' })
      .then(users => {
        const data = {
          title: 'Log in Fake User',
          user: req.user,
          users: users
        }
        res.render('fake_login', data)
      })
      .catch(err => console.log(err))
  })

  app.post(
    '/auth/fake',
    passport.authenticate('custom', {
      failureRedirect: '/fake_login',
      successRedirect: '/'
    })
  )
}
