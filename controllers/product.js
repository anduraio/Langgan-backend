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

var Product = require('../models/product');

exports.create_post = function(req, res) {
  var photo = "https://i1.wp.com/thefrontline.org.uk/wp-content/uploads/2018/10/placeholder.jpg";
  console.log("price " + req.body.price)
  Product.create({
    store_id : req.body.store_id,
    name: req.body.name,
    description: req.body.description,
    photo: req.body.photo,
    category_id: req.body.category_id,
    category_name: req.body.category_name,
    brand: req.body.brand,
    barcode: req.body.barcode,
    photo: photo,
    sku: req.body.sku,
    description: req.body.description,
    price: req.body.price,
    created_at: Date.now()
  },
  function (err, data) {
    if (err) return res.status(500).send({
      message: "There was a problem create a new product.",
      error: err
    });

    res.status(200).send({
      status: 200,
      product: data
    });
  });
};

exports.new_post = function(req, res, next) {
  console.log("body " + req.body.satu);
  console.log("file " + req.files);
  var data = req.body.satu;
  var file = req.files;
  res.status(200).send({ status: 200, data: data, file: file});
}

exports.list = function(req, res, next) {
  Product.find({}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of products." });
    if (!data) return res.status(404).send({ status: 404, message: "No product found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.list_products = function(req, res, next) {
  Product.find({store_id: req.params.id}, function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of products." });
    if (!data) return res.status(404).send({ status: 404, message: "No product found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.product_detail = function(req, res, next) {
  Product.findById(req.params.id, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding product." });
    if (!data) return res.status(404).send({ status: 404, message: "No product found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.product_delete = function(req, res, next) {
  Product.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete a product." });
    res.status(200).send({ status: 200, message: "product was deleted" });
  })
}

exports.product_update = function(req, res, next) {
  var product = new Product({
    store_id : req.body.store_id,
    name: req.body.name,
    photo: req.body.photo,
    category_id: req.body.category_id,
    category_name: req.body.category_name,
    brand: req.body.brand,
    barcode: req.body.barcode,
    sku: req.body.sku,
    description: req.body.description,
    photo: req.body.photo,
    price: req.body.price,
    _id: req.params.id
  });

  Product.findByIdAndUpdate(req.params.id, product, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update product." });
    res.status(200).send({ status: 200, data: product });
  })
}