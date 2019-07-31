var express = require('express');
var router = express.Router();
const chapter = require('../lib/chapter');


router.get('/view/:topicId/:chapterId', function(request, response){
    chapter.page(request, response);
});

router.get('/create/:topicId', function(request, response) {
    chapter.create(request, response);
});

router.post('/create_process', function(request, response){
    chapter.create_process(request, response);
});

// router.get('/update/:pageId', function(request, response) {
//     topic.update(request, response);
// });

// router.post('/update_process', function(request, response){
//     topic.update_process(request, response);
// });

// router.post('/delete_process', function(request, response){
//     topic.delete_process(request, response);
// });

module.exports = router;