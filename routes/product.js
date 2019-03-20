var express = require('express');
var router = express.Router();
var multer  = require('multer')
// text format
var textForm = multer()
// file format
var uploadForm = multer({ dest: 'uploads/' })
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

var product = require('../controllers/product');

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

// router.post('/new', verifyToken, product.create_post);
router.post('/new', verifyToken, textForm.none(), product.create_post);

// router.post('/test', verifyToken, uploadForm.array('photos', 2), product.new_post);
// router.post('/test', verifyToken, uploadForm.single('file'), product.new_post);

router.get('/', verifyToken, product.list);

router.get('/list/:id', verifyToken, product.list_products);

router.get('/:id', verifyToken, product.product_detail);

router.delete('/:id', verifyToken, product.product_delete);

router.put('/:id', verifyToken, product.product_update);

module.exports = router;
