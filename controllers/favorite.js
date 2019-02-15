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

var Favorite = require('../models/favorite');

exports.create = function(req, res) {
  Favorite.create({
    user_id : req.userId,
    product: req.body.product_id,
    created_at: Date.now()
  },
  function (err, data) {
    if (err) return res.status(500).send({
      message: "There was a problem add a new favorite.",
      error: err
    });

    res.status(200).send({
      status: 200,
      data: data
    });
  });
};

exports.list = function(req, res, next) {
  Favorite
    .find({})
    .populate('product')
    .exec(function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of favorite." });
    if (!data) return res.status(404).send({ status: 404, message: "No favorite found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.detail = function(req, res, next) {
	Favorite
    .findById(req.params.id)
    .populate('product')
		.exec(function (err, data) {
	      if (err) return res.status(500).send({ status: 500, message: "There was a problem finding favorite." });
	      if (!data) return res.status(404).send({ status: 404, message: "No favorite found." });
	      // Successful, so render
	      res.status(200).send({ status: 200, data: data });
	    });
}

exports.delete = function(req, res, next) {
  Favorite.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete a favorite." });
    res.status(200).send({ status: 200, message: "favorite was deleted" });
  })
}

exports.update = function(req, res, next) {
  var favorite = new Favorite({
    user_id : req.userId,
    product: req.body.product_id,
    rate: req.body.rate,
    _id: req.params.id
  });

  Favorite.findByIdAndUpdate(req.params.id, favorite, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update favorite." });
    res.status(200).send({ status: 200, data: favorite });
  })
}
