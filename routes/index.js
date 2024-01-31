var express = require('express');
var router = express.Router();
var passport = require('passport')
var userModel = require('./users')

const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', isLoggedIn, function (req, res, next) {
  res.render('chat', { title: 'Express' });
});


//register User
router.post('/register', function (req, res, next) {
  var newUser = new userModel({
    username: req.body.username,
    name: req.body.name,
    pic: req.body.pic,
    email: req.body.email,
    about: req.body.about
  })

  userModel.register(newUser, req.body.password).then(function (registerusers) {
    passport.authenticate('local')(req, res, function () {
      res.redirect('/profile')
    })
  })
    .catch(function (e) {
      res.send(e)
    })
})



//profile page
router.get('/profile', isLoggedIn, function (req, res, next) {
  userModel.findOne({ username: req.session.passport.user }).then(function (users) {
    res.render('profile', { users })
  })
})

router.get("/allusers", isLoggedIn, function (req, res, next) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedInUser) {
      userModel.find().then(function (allusers) {
        res.render('allusers', { allusers, loggedInUser })
      })
    })
})
//delete user

router.get('/delete/:id', isLoggedIn, function (req, res) {
  userModel.findOneAndDelete({ username: req.session.passport.user }).then(function (deleteuser) {
    res.redirect("/")
  })
})

//friendsZone
router.get("/friend/:id", function (req, res, next) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedInUser) {
      userModel.findOne({ _id: req.params.id })
        .then(function (jisefriendbnanahai) {
          loggedInUser.friends.push(jisefriendbnanahai._id)
          jisefriendbnanahai.friends.push(loggedInUser._id)
          console.log("Add huaa")
          loggedInUser.save().then(function () {
            jisefriendbnanahai.save().then(function () {
              res.redirect('/allusers')
            })
          })
        })
    })
})



//Log in
router.get('/login', function (req, res, next) {
  res.render('login')
})
router.post("/login", passport.authenticate('local', {
  successRedirect: 'profile',
  failureRedirect: 'login'
}), function (req, res, next) { });


//Log out
router.get('/logout', function (req, res, next) {
  req.logOut().then(function (a) {
    alert(a)
  });
  res.redirect('/')
});


//IsLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  else {
    res.redirect('/')
  }
}

module.exports = router;