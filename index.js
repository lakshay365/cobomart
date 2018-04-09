const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const keys = require('./config/keys')

// Require models here
require('./models/ad')
require('./models/institute')
require('./models/user')

// Require passport service
require('./services/passport')

mongoose.connect(keys.mongoURI)

mongoose.connection
  .once('open', () => {
    console.log('Connected to mongodb')
  })
  .on('error', err => console.warn('Warning', err))

const app = express()

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))

require('./routes/main')(app)
require('./routes/auth')(app)
require('./routes/ad')(app)
require('./routes/marketplace')(app)
require('./fake')(app)
require('./routes/dashboard')(app)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Listening on port', PORT)
})
