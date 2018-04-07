// This file is responsible for setting auth.
// Passport strategies have been implemented here.
// Please watch `routes/auth.js` for related route
// handlers.

const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('mongoose').model('user')
const keys = require('../config/keys')

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user)
  })
})

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebook.appID,
      clientSecret: keys.facebook.appSecret,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'name', 'email'],
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser(profile, done)
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser(profile, done)
    }
  )
)

function findOrCreateUser(profile, done) {
  User.findOne({ providerId: profile.id })
    .then(user => {
      if (user) return user
      else {
        const defaultName = `${profile.name.givenName} ${
          profile.name.familyName
        }`
        const user = new User({
          name: profile.displayName || defaultName,
          provider: profile.provider,
          providerId: profile.id,
          email: profile.emails[0].value
        })

        return user.save()
      }
    })
    .then(user => done(null, user))
    .catch(err => {
      done(err)
    })
}
