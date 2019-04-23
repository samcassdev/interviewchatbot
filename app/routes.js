module.exports = function(app, passport, db, ObjectId) {

// page endpoints ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    const chatLog = {
      _id: new ObjectId(),
      responses: []
    }
    db.collection('chatLogs').save(chatLog)
    res.render('index.ejs', {
      logId : chatLog._id
    })
  });

  // PROFILE SECTION =========================
  app.get('/interview', isLoggedIn, function(req, res) {
    var query = {}
    if ('userId' in req.query) {
      query['userId'] = req.query.userId
    } else {
      query['userId'] = -1
    }
    console.log("hello" , req.session.passport.user)
    db.collection('chatLogs').find(query).toArray((err, result) => {
      res.render('interview.ejs', {
        chatLogs: result
      })
    })
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    console.log("hello" , req.session.passport.user)
      res.render('profile.ejs', {
        userId: req.session.passport.user
      })
    });

  app.get('/chatbot', function(req, res) {
    const chatLog = {
      _id: new ObjectId(),
      responses: []
    }
    if ('userId' in req.query) {
      chatLog['userId'] = req.query.userId
    }
    db.collection('chatLogs').save(chatLog)
    res.render('chatbot.ejs', {
      logId : chatLog._id,
      userId: chatLog.userId
    })
  });

// api endpoints

  app.put('/api/chatLogs', (req,res) => {
    var message = req.body.message;
    db.collection('chatLogs').findOneAndUpdate({_id: ObjectId(req.body._id)}, {
      $push: { responses : req.body.message }
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send(result)
    })
  })

  app.delete('/api/chatLogs', (req, res) => {
    db.collection('chatLogs').findOneAndDelete({_id: ObjectId(req.body._id), responses : req.body.message}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/interview');
    });
  });

  // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next();
  res.redirect('/');
}
