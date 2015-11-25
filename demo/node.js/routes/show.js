var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {
    res.render('show.html', {
        "img_src": req.body["img64"]
    });
});

module.exports = router;
