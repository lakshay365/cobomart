const Ad = require('../models/ad')
const User = require('../models/user')

function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/login')
  else next()
}

module.exports = app => {
  app.get('/submit', loggedIn, (req, res) => {
    res.render('submit')
  })

  app.get('/marketplace', loggedIn, (req,res) => {
  	Ad.find({},(err, data) => {
  		if(err){
  			return console.log(err)
  		}
  		res.render('marketplace',{data:data})
  	})
  })

  app.post('/submit', loggedIn, (req, res) => {
    var book = new Ad({
    	title: req.body.title,
    	description: req.body.description,
    	price: req.body.price,
    	negotiable: (req.body.negotiable == 'on')?true:false,
    	condition: req.body.condition,
    	user: req.user._id
    })

    book.save(function(err){
    	if(err){
    		return console.log(err)
    	}
    	console.log('saved')
    })

    res.render('submit')
  })
}