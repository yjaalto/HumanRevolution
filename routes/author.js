var express = require('express');
var router = express.Router();
const author = require('../lib/author');



router.post('/create_process', (request, response) => author.create_process(request, response));

router.get('/update/:authorId', (request, response) => author.update(request, response));

router.post('/update_process', (request, response) => author.update_process(request, response));

router.post('/delete_process', (request, response) => author.delete_process(request, response));

module.exports = router;