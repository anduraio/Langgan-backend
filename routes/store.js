var express = require('express');
var router = express.Router();
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

var store = require('../controllers/store');

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

router.post('/new', verifyToken, store.create_post);

router.post('/post', verifyToken, store.post);

router.get('/', verifyToken, store.list);

router.get('/:id', verifyToken, store.store_detail);

router.get('/mystore/:id', verifyToken, store.my_store);

router.delete('/:id', verifyToken, store.store_delete);

router.put('/:id', verifyToken, store.store_update);

module.exports = router;
