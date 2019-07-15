var express = require('express');
var router = express.Router();
const topic = require('../lib/topic');

router.get('/', (req, res) => topic.home(res));

module.exports = router;