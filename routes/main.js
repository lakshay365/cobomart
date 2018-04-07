function alreadyLoggedIn(req, res, next) {
  if (req.user) res.redirect('/')
  else next()
}

module.exports = app => {
  app.get('/', (req, res) => {
    const data = {
      title: 'Cobomart - Buy and Sell books!',
      loggedIn: !!req.user
    }

    if (data.loggedIn) data.name = req.user.name

    res.render('home', data)
  })

  app.get('/login', alreadyLoggedIn, (req, res) => {
    res.render('login')
  })

  app.get('/logout', (req, res) => {
    if (req.user) req.logout()
    res.redirect('/')
  })

  app.get('/user', (req, res) => {
    if (req.user) res.send(req.user.name)
    else res.redirect('/login')
  })
}
