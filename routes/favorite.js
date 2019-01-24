var express = require('express');
var router = express.Router();
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

var favorite = require('../controllers/favorite');

function verifyToken(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['token'];
  if (!token)
    return res.status(403).send({ status: 403, auth: false, message: 'No token provided.' });

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
      return res.status(500).send({ status: 500, auth: false, message: 'Failed to authenticate token.' });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });

}

router.post('/new', verifyToken, favorite.create);

router.get('/', verifyToken, favorite.list);

router.get('/:id', verifyToken, favorite.detail);

router.delete('/:id', verifyToken, favorite.delete);

router.put('/:id', verifyToken, favorite.update);

module.exports = router;
