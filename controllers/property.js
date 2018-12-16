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

var Property = require('../models/property');

exports.create_post = function(req, res) {
  Property.create({
    user_id : req.userId,
    name: req.body.name,
    address: req.body.address,
    state: req.body.state,
    city: req.body.city,
    postal_code: req.body.postal_code,
    type: req.body.type
  },
  function (err, property) {
    if (err) return res.status(500).send({
      message: "There was a problem create a new property.",
      error: err
    });

    res.status(200).send({
      status: 200,
      property: property
    });
  });
};

exports.property_list = function(req, res, next) {
  Property.find({"user_id" : req.userId}, function (err, properties) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of property." });
    if (!properties) return res.status(404).send({ status: 404, message: "No property found." });
    res.status(200).send({ status: 200, data: properties });
  })
}

exports.property_detail = function(req, res, next) {
  Property.findById(req.params.id, function(err, property) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding the propery." });
    if (!property) return res.status(404).send({ status: 404, message: "No property found." });
    res.status(200).send({ status: 200, data: property });
  })
}

exports.property_delete = function(req, res, next) {
  Property.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete the propery." });
    res.status(200).send({ status: 200, message: "property was deleted" });
  })
}

exports.property_update = function(req, res, next) {
  var property = new Property({
    user_id : req.userId,
    name: req.body.name,
    address: req.body.address,
    state: req.body.state,
    city: req.body.city,
    postal_code: req.body.postal_code,
    type: req.body.type,
    _id: req.params.id
  });

  Property.findByIdAndUpdate(req.params.id, property, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update the propery." });
    res.status(200).send({ status: 200, data: property });
  })
}
