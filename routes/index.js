var express = require('express');
var router = express.Router();
const { getUserACList } = require('../accountCrawler.js');

/* GET home page. */
router.get('/', getUserACList);

module.exports = router;
