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

var Box = require('../models/box');
var Item = require('../models/item');
var Product = require('../models/product');

var async = require('async');

exports.create_post = function(req, res) {
  Box.create({
    name: req.body.name,
    store_id: req.body.store_id,
    description: req.body.description,
    price: req.body.price,
    products: req.body.products,
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

exports.create_post_new = [
  (req, res, next) => {
      if(!(req.body.products instanceof Array)){
          if(typeof req.body.products==='undefined') {
            console.log("new box undefined")
            req.body.products=[];
          }
          else {
            console.log("new box defined")
            req.body.products=new Array(req.body.products);
          }
      }
      next();
  },
  (req, res, next) => {

    var items = []

    async.forEachOf(req.body.products, function (value, key, callback) {
        Item.create({
          product: value,
          qty: req.body.qty[key],
          sub_total_price: req.body.sub_total_price[key],
          created_at: Date.now()
        },
        function (err, data) {

          console.log("error item " + err)
          console.log("id item " + data._id)
          items.push(data._id)
          callback();

        });
    }, function (err) {
        if (err) return res.status(500).send({
          message: "There was a problem create box item.",
          error: err
        });

        console.log("items " + items.length)

        Box.create({
          name: req.body.name,
          store_id: req.body.store_id,
          description: req.body.description,
          price: req.body.price,
          items: items,
          created_at: Date.now()
        },
        function (err, data) {
          if (err) return res.status(500).send({
            message: "There was a problem create a new box.",
            error: err
          });

          res.status(200).send({
            status: 200,
            data: data
          });
        });
    });
  }
];

exports.box_create_post = [
    // Convert the products to an array.
    (req, res, next) => {
        if(!(req.body.products instanceof Array)){
            if(typeof req.body.products==='undefined') {
            	req.body.products=[];
            }
            else {
            	req.body.products=new Array(req.body.products);
            }
        }
        next();
    },

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('price', 'Price must not be empty.').isLength({ min: 1 }).trim(),
  
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    sanitizeBody('products.*').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var box = new Box(
          { name: req.body.name,
            store_id: req.body.store_id,
            description: req.body.description,
            price: req.body.price,
            products: req.body.products
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            return res.status(500).send({
    		      message: "There was a problem create a new box.",
    		      error: err
    		    });
        }
        else {
          Box.create({
    			    store_id : req.body.store_id,
    			    name: req.body.name,
    			    description: req.body.description,
    			    price: req.body.price,
    			    created_at: Date.now()
    			},
    			function (err, data) {
    			    if (err) return res.status(500).send({
    			      message: "There was a problem create a new box.",
    			      error: err
    			    });

    			    res.status(200).send({
    			      status: 200,
    			      product: data
    			    });
    			});
        }
    }
];

exports.list = function(req, res, next) {
  Box.find({})
    .populate('items')
  	.exec(function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of box." });
    if (!data) return res.status(404).send({ status: 404, message: "No box found." });
    
    if (data.length == 0) return res.status(200).send({ status: 200, data: data });

    async.forEach(data,function(item,callback) {
        Product
        .populate(item.items,{ "path": "product" },function(err,output) {
            if (err) console.log("error " + err);
            callback();
        });
    }, function(err) {
        if (err) return res.status(500).send({ status: 500, message: "There was a problem finding a product." });
        res.status(200).send({ status: 200, data: data });
    });

    // res.status(200).send({ status: 200, data: data });
  })
}

exports.list_boxes = function(req, res, next) {
  Box.find({store_id: req.params.id})
    .populate('products')
    .exec(function (err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem finding list of boxes." });
    if (!data) return res.status(404).send({ status: 404, message: "No boxes found." });
    res.status(200).send({ status: 200, data: data });
  })
}

exports.detail = function(req, res, next) {
	Box.findById(req.params.id)
		.populate('products')
		.exec(function (err, data) {
	      if (err) return res.status(500).send({ status: 500, message: "There was a problem finding box." });
	      if (!data) return res.status(404).send({ status: 404, message: "No box found." });
	      // Successful, so render
	      res.status(200).send({ status: 200, data: data });
	    });
}

exports.delete = function(req, res, next) {
  Box.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to delete a box." });
    res.status(200).send({ status: 200, message: "box was deleted" });
  })
}

exports.update = function(req, res, next) {
  var box = new Box({
    name: req.body.name,
    store_id: req.body.store_id,
    description: req.body.description,
    price: req.body.price,
    products: req.body.products,
    _id: req.params.id
  });

  Box.findByIdAndUpdate(req.params.id, box, {}, function(err, data) {
    if (err) return res.status(500).send({ status: 500, message: "There was a problem to update box." });
    res.status(200).send({ status: 200, data: box });
  })
}
