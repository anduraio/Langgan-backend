const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');
const bcrypt = require('bcryptjs');
var async = require('async');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

var User = require('../models/user');
var Store = require('../models/store');

exports.list = function(req, res, next) {
  User.find({}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of user." });
    if (!data) return res.status(404).send({ status: 404, message: "No user found." });
    res.status(200).send({ status: 200, data: data });
  })
}

// CREATES A NEW USER
exports.register = function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    password : hashedPassword,
    created_at: Date.now()
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user." );

    // if user is registered without errors
    // create a token
    let expiresIn = 86400;
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: expiresIn // expires in 24 hours
    });

    res.status(200).send({ status: 200, auth: true, token: token, expiresIn: expiresIn });
  });
};


// CREATES A NEW OWNER
exports.register_owner = function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    password : hashedPassword,
    created_at: Date.now()
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user." + err);

    // if user is registered without errors
    // create a token
    let expiresIn = 86400;
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: expiresIn // expires in 24 hours
    });

    Store.create({
      user_id: user._id,
      name: req.body.name,
      description: "",
      email: req.body.email,
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      created_at: Date.now()
    }, function (err, store) {
      if (err) return res.status(500).send("There was a problem registering the store`.");

      res.status(200).send({ status: 200, auth: true, token: token, expiresIn: expiresIn, user: user, store: store });
    })

    //res.status(200).send({ status: 200, auth: true, token: token, expiresIn: expiresIn });
  });
};

// LOGIN OWNER
exports.login_owner = function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    let expiresIn = 86400;
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: expiresIn // expires in 24 hours
    });

    Store.find({ user_id: user._id }, function(err, stores) {
      if (err) return res.status(500).send({ status: 500, message: "There was a problem finding stores." });
      if (!stores) return res.status(404).send({ status: 404, message: "No stores found." });
      res.status(200).send({ status: 200, auth: true, token: token, expiresIn: expiresIn, user: user, store: stores });
    })

    // return the information including token as JSON
    //res.status(200).send({ status: 200, auth: true, token: token, expiresIn: expiresIn, data: user });
  });
};


// LOGIN
exports.login = function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    let expiresIn = 86400;
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: expiresIn // expires in 24 hours
    });

    // return the information including token as JSON
    res.status(200).send({ status: 200, auth: true, token: token, expiresIn: expiresIn, data: user });
  });
};


// LOGOUT
exports.logout = function(req, res) {
  res.status(200).send({ status: 200, auth: false, token: null });
};


// VIEW USER PROFILE
/*exports.profile =  function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding the user." });
    if (!user) return res.status(404).send({ status: 404, message: "No user found." });
    res.status(200).send({ status: 200, data: user });
  });

};*/
exports.profile =  function(req, res, next) {
  async.parallel({
    user: function(callback) {
      User.findById(req.userId).exec(callback);
    },
    stores: function(callback) {
      Store.find({ user_id: req.userId }).exec(callback);
    },
  }, function(err, results) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding the user." });
    if (!results.user) return res.status(404).send({ status: 404, message: "No user found." });
    res.status(200).send({ status: 200, data: results.user, stores: results.stores });

  });
};

// DELETE USER
exports.user_delete = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete a user." });
    res.status(200).send({ status: 200, message: "user was deleted" });
  })
}
