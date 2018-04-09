function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/')
  else next()
}

module.exports = app => {
  app.get('/dashboard', loggedIn, (req, res) => {
    const data = {
      title: `Dashboard - ${req.user.name}`,
      user: req.user
    }
    res.render('dashboard', data)
  })
}
