const {
  body,
  validationResult
} = require('express-validator/filter');
const bcrypt = require('bcryptjs');
var async = require('async');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

var Store = require('../models/store');

exports.create_post = function(req, res) {
  Store.create({
    user_id : req.userId,
    name: req.body.name,
    description: req.body.description,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country
  },
  function (err, data) {
    if (err) return res.status(500).send({
      message: "There was a problem create a new store.",
      error: err
    });

    res.status(200).send({
      status: 200,
      store: data
    });
  });
};

exports.list = function(req, res, next) {
  Store.find({"user_id" : req.userId}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of store." });
    if (!data) return res.status(404).send({ status: 404, message: "No store found." });
    res.status(200).send({ status: 200, data: data });
  })
}
