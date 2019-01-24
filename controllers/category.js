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

var Category = require('../models/category');

exports.create = function(req, res) {
  Category.create({
    name: req.body.name,
    created_at: Date.now()
  },
  function (err, data) {
    if (err) return res.status(500).send({
      message: "There was a problem create a new category.",
      error: err
    });

    res.status(200).send({
      status: 200,
      data: data
    });
  });
};

exports.list = function(req, res, next) {
  Category.find({}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of category." });
    if (!data) return res.status(404).send({ status: 404, message: "No categroy found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.detail = function(req, res, next) {
	Category.findById(req.params.id)
		.exec(function (err, data) {
	      if (err) return res.status(500).send({ status: 500, message: "There was a problem finding category." });
	      if (!data) return res.status(404).send({ status: 404, message: "No category found." });
	      
	      res.status(200).send({ status: 200, data: data });
	    });
}

exports.delete = function(req, res, next) {
  Category.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete a category." });
    res.status(200).send({ status: 200, message: "category was deleted" });
  })
}

exports.update = function(req, res, next) {
  var category = new Category({
    name: req.body.name,
    _id: req.params.id
  });

  Category.findByIdAndUpdate(req.params.id, category, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update category." });
    res.status(200).send({ status: 200, data: category });
  })
}