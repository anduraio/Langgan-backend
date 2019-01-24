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

var Review = require('../models/review');

exports.create = function(req, res) {
  Review.create({
  	user_id : req.userId,
    product_id: req.body.product_id,
    review: req.body.review,
    rate: req.body.rate,
    created_at: Date.now()
  },
  function (err, data) {
    if (err) return res.status(500).send({
      message: "There was a problem create a new review.",
      error: err
    });

    res.status(200).send({
      status: 200,
      data: data
    });
  });
};

exports.list = function(req, res, next) {
  Review.find({}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of review." });
    if (!data) return res.status(404).send({ status: 404, message: "No review found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.detail = function(req, res, next) {
	Review.findById(req.params.id)
		.exec(function (err, data) {
	      if (err) return res.status(500).send({ status: 500, message: "There was a problem finding review." });
	      if (!data) return res.status(404).send({ status: 404, message: "No review found." });
	      // Successful, so render
	      res.status(200).send({ status: 200, data: data });
	    });
}

exports.delete = function(req, res, next) {
  Review.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete a review." });
    res.status(200).send({ status: 200, message: "review was deleted" });
  })
}

exports.update = function(req, res, next) {
  var review = new Review({
    user_id : req.userId,
    product_id: req.body.product_id,
    review: req.body.review,
    rate: req.body.rate,
    _id: req.params.id
  });

  Review.findByIdAndUpdate(req.params.id, review, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update review." });
    res.status(200).send({ status: 200, data: review });
  })
}
