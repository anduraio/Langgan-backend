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

var Customer = require('../models/customer')

exports.create = function(req, res) {
	Customer.create({
		user_id : req.userId,
		rate: req.body.rate,
    	created_at: Date.now()
	},
	function (err, data) {
    if (err) return res.status(500).send({
      message: "There was a problem create a new customer.",
      error: err
    });

    res.status(200).send({
      status: 200,
      data: data
    });
  });
}

exports.list = function(req, res, next) {
  Customer.find({}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of customer." });
    if (!data) return res.status(404).send({ status: 404, message: "No customer found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.detail = function(req, res, next) {
	Customer.findById(req.params.id)
		.exec(function (err, data) {
	      if (err) return res.status(500).send({ status: 500, message: "There was a problem finding customer." });
	      if (!data) return res.status(404).send({ status: 404, message: "No customer found." });
	      // Successful, so render
	      res.status(200).send({ status: 200, data: data });
	    });
}

exports.delete = function(req, res, next) {
  Customer.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to customer a customer." });
    res.status(200).send({ status: 200, message: "customer was deleted" });
  })
}

exports.update = function(req, res, next) {
  var customer = new Customer({
    user_id : req.userId,
    _id: req.params.id
  });

  Customer.findByIdAndUpdate(req.params.id, customer, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update customer." });
    res.status(200).send({ status: 200, data: customer });
  })
}
