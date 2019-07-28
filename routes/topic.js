var express = require('express');
var router = express.Router();
const topic = require('../lib/topic');


router.get('/page/:topicId', function(request, response){
    topic.page(request, response);
});

router.get('/create/:topicId', function(request, response) {
    topic.create(request, response);
});

router.post('/create_process', function(request, response){
    topic.create_process(request, response);
});

router.get('/update/:topicId', function(request, response) {
    topic.update(request, response);
});

router.post('/update_process', function(request, response){
    topic.update_process(request, response);
});

router.post('/delete_process', function(request, response){
    topic.delete_process(request, response);
});

module.exports = router;