const {
  body,
  validationResult
} = require('express-validator/filter');
const bcrypt = require('bcryptjs');
var async = require('async');
const formidable = require('formidable');

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

exports.post = function(req, res) {
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    console.log('Fields', fields);
    console.log('name', fields.name);
    console.log('Files', files);
    res.status(200).send({ status: 200, message: "oke" });
  })
};

/*exports.list = function(req, res, next) {
  Store.find({"user_id" : req.userId}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of store." });
    if (!data) return res.status(404).send({ status: 404, message: "No store found." });
    res.status(200).send({ status: 200, data: data });
  })
}*/

exports.list = function(req, res, next) {
  Store.find({}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of store." });
    if (!data) return res.status(404).send({ status: 404, message: "No store found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.store_detail = function(req, res, next) {
  Store.findById(req.params.id, function(err, store) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding store." });
    if (!store) return res.status(404).send({ status: 404, message: "No store found." });
    res.status(200).send({ status: 200, data: store });
  })
}

exports.my_store = function(req, res, next) {
  Store.find({ user_id: req.params.id }, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding store." });
    if (!data) return res.status(404).send({ status: 404, message: "No store found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.store_delete = function(req, res, next) {
  Store.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete a store." });
    res.status(200).send({ status: 200, message: "store was deleted" });
  })
}

exports.store_update = function(req, res, next) {
  var store = new Store({
    user_id : req.userId,
    name: req.body.name,
    description: req.body.description,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    _id: req.params.id
  });

  Store.findByIdAndUpdate(req.params.id, store, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update store." });
    res.status(200).send({ status: 200, data: store });
  })
}
