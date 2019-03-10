var express = require('express');
var router = express.Router();
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

router.post('/register', user.register);

router.post('/registerowner', user.register_owner);

router.get('/', verifyToken, user.list);

router.post('/login', user.login);

router.post('/loginowner', user.login_owner);

router.get('/logout', user.logout);

router.get('/profile', verifyToken, user.profile);

router.delete('/:id', verifyToken, user.user_delete);

module.exports = router;
