const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
var async = require('async');
const formidable = require('formidable');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

var Subs = require('../models/subscription');

exports.create = function(req, res) {
  Subs.create({
    store_id: req.body.store_id,
    user_id: req.userId,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    delivery: req.body.delivery,
    created_at: Date.now()
  },
  function (err, data) {
    if (err) return res.status(500).send({
      message: "There was a problem add a new subscription.",
      error: err
    });

    res.status(200).send({
      status: 200,
      data: data
    });
  });
};

exports.list = function(req, res, next) {
  Subs.find({}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of subscription." });
    if (!data) return res.status(404).send({ status: 404, message: "No subscription found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.detail = function(req, res, next) {
	Subs.findById(req.params.id)
		.exec(function (err, data) {
	      if (err) return res.status(500).send({ status: 500, message: "There was a problem finding subscription." });
	      if (!data) return res.status(404).send({ status: 404, message: "No subscription found." });
	      // Successful, so render
	      res.status(200).send({ status: 200, data: data });
	    });
}

exports.delete = function(req, res, next) {
  Subs.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete a subscription." });
    res.status(200).send({ status: 200, message: "subscription was deleted" });
  })
}

exports.update = function(req, res, next) {
  var subscription = new Subs({
    store_id: req.body.store_id,
    user_id: req.body.user_id,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    delivery: req.body.delivery,
    _id: req.params.id
  });

  Subs.findByIdAndUpdate(req.params.id, subscription, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update subscription." });
    res.status(200).send({ status: 200, data: subscription });
  })
}