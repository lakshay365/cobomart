function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/login')
  else next()
}

module.exports = app => {
  app.get('/submit', loggedIn, (req, res) => {
    res.render('submit')
  })

  app.post('/submit', loggedIn, (req, res) => {
    // TODO
  })
}
