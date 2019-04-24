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
var Product = require('../models/product');
var Item = require('../models/item');

exports.create = function(req, res) {
  if(!(req.body.plan instanceof Array)){
    if(typeof req.body.plan==='undefined') {
      req.body.plan=[];
    }
    else {
      req.body.plan=new Array(req.body.plan);
    }
  }

  Subs.create({
    store_id: req.body.store_id,
    user_id: req.userId,
    plan: req.body.plan,
    lat: req.body.lat,
    lon: req.body.lon,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    delivery: req.body.delivery,
    status: req.body.status,
    total_price: req.body.total_price,
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
  Subs.find({})
    .populate('plan')
    .exec(function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of subscription." });
    if (!data) return res.status(404).send({ status: 404, message: "No subscription found." });
    
    async.forEach(data,function(item,callback) {
        console.log("populate Items")
        Item.populate(item.plan,{ "path": "items", populate: { path: 'product', model: 'Product' }},function(err,output) {
            if (err) throw err;
            callback();
        });
    }, function(err) {
        if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of products." });
        res.status(200).send({ status: 200, data: data });
    });

    //res.status(200).send({ status: 200, data: array });
  })
}   

exports.list_by_store = function(req, res, next) {
  Subs.find({store_id: req.params.id})
    .populate('plan')
    .populate('user_id')
    .exec(function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of subscription." });
    if (!data) return res.status(404).send({ status: 404, message: "No subscription found." });
    
    async.forEach(data,function(item,callback) {
        Product.populate(item.plan,{ "path": "products" },function(err,output) {
            if (err) throw err;
            callback();
        });
    }, function(err) {
        if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of products." });
        res.status(200).send({ status: 200, data: data });
    });

    //res.status(200).send({ status: 200, data: array });
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
    plan: req.body.plan,
    lat: req.body.lat,
    lon: req.body.lon,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    delivery: req.body.delivery,
    status: req.body.status,
    _id: req.params.id
  });

  Subs.findByIdAndUpdate(req.params.id, subscription, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update subscription." });
    res.status(200).send({ status: 200, data: subscription });
  })
}