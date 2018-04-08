const Ad = require('../models/ad')
const User = require('../models/user')

function loggedIn(req, res, next) {
  if (!req.user) res.redirect('/login')
  else next()
}

module.exports = app => {
  app.get('/marketplace', loggedIn, (req,res) => {
  	Ad.find({},(err, data) => {
  		if(err){
  			return console.log(err)
  		}
  		res.render('marketplace',{data:data, user:req.user})
  	})
  })

  app.get('/marketplace/:id', loggedIn, (req,res) => {
  	Ad.findOne({_id:req.params.id}, (err,data) => {
  		if(err){
  			return console.log(err)
  		}
  		User.findOne({_id: data.user}, (err,doc) => {
  			if(err){
  				return console.log(err)
  			}
  			data.username = doc.name
  			res.render('advertisement',{data: data, user: req.user})
  		})
  	})
  })
}