const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');

router.get('/', function(req, res){
    res.sendFile(__dirname + '/united_index.html');
});

module.exports = router;