const {
  body,
  validationResult
} = require('express-validator/filter');
const bcrypt = require('bcryptjs');
var async = require('async');

exports.list = function(req, res, next) {
  res.status(200).send({ status: 200, data: "my_token_verify" });
}