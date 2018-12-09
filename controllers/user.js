const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');
const bcrypt = require('bcryptjs');
var async = require('async');
var client = require('redis').createClient(process.env.REDIS_URL);

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

var User = require('../models/user');

// CREATES A NEW USER
exports.register = function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    password : hashedPassword
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user`.");

    // if user is registered without errors
    // create a token
    let expiresIn = 86400;
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: expiresIn // expires in 24 hours
    });

    res.status(200).send({ status: 200, auth: true, token: token, expiresIn: expiresIn });
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
    res.status(200).send({ status: 200, auth: true, token: token, expiresIn: expiresIn });
  });
};


// LOGOUT
exports.logout = function(req, res) {
  res.status(200).send({ status: 200, auth: false, token: null });
};


// VIEW USER PROFILE
exports.profile =  function(req, res, next) {
  const userId = req.userId;
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding the user." });
    if (!user) return res.status(404).send({ status: 404, message: "No user found." });
    client.setex(userId, 3600, user);
    res.status(200).send({ status: 200, data: user });
  });

};
