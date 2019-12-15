const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var NodeWebcam = require( "node-webcam" );


router.post('/reload', function(req, res){
    var Webcam = NodeWebcam.create({});
    var opts = {
        width: 256,
        height: 256,
        delay: 0,
        quality: 100,
        output: "png"
    };

    NodeWebcam.capture(__dirname+'\\..\\public\\web.png', opts, function(err, Buff){ 
        res.send("done");
    });
/*
    NodeWebcam.capture( "test_picture", opts, function( err, img ) {
        //console.log(img);
        var data=img.slice(img.indexOf(',')+1).replace(/\s/g,'+');
        var buf = Buffer.from(data, 'base64'); 
        fs.writeFileSync(__dirname+'\\..\\public\\web.png', img);
        //res.send(img);
    });
    */
});

router.get('/', function(req, res){
    res.sendFile(__dirname + "/cam_index.html");
});

module.exports = router;