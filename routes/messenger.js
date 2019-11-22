var express = require('express');
var router = express.Router();

var messenger = require('../controllers/messenger');

router.get('/verifytoken', messenger.verify);

module.exports = router;
