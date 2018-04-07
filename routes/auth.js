const passport = require('passport')

module.exports = app => {
  // Facebook Authentication
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
  )

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  )

  // Google Authentication
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  )

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  )
}
