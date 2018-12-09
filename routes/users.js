var express = require('express');
var router = express.Router();
var client = require('redis').createClient(process.env.REDIS_URL);
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

var user = require('../controllers/user');

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

function cache(req, res, next) {
    const userId = req.userId;
    client.hmget(userId, function (err, data) {
        if (err) throw err;

        if (data != null) {
            res.status(200).send({ status: 200, data: data });
        } else {
            next();
        }
    });
}

router.post('/register', user.register);

router.post('/login', user.login);

router.get('/logout', user.logout);

router.get('/profile', verifyToken, cache, user.profile);

module.exports = router;
