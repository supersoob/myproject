const express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
var qs = require('querystring');
var template = require('../lib/template.js');


router.post('/test', function(req,res){

    
    var post = req.body.filedir;
    var filedir = './public/' + post;

    var imageData = ``


//    var file = fs.readFileSync(`./public/test/size_filelist`,"utf8");
//    var filelist = file.split('\n');

    var filelist = fs.readdirSync(filedir,"utf8");
    console.log(filelist);
    var len = filelist.length;
    console.log(len);
    var rand = template.random(len);
    console.log(rand);

    for(var i=1;i<=4;i++){
        var parseName = filelist[rand[i-1]].split('.jpg')[0];
        var soundSrc = 'sounds/sound_' + parseName + '.wav';
    
        imageData += 
        `<div class="column">
        <div class="ui grey card" style="cursor:pointer">
                <div class="image">
                <img src ="${post + '/' + filelist[rand[i-1]]}" id="case_image${i}" onclick="matchAnswer(${i})">
                <audio id="audio${i}" src="${soundSrc}" ></audio>
                </div>
        </div></div>
        `
    }
  
    var pick = Math.floor(Math.random()*4);
    //var answer = filelist[rand[pick]].split('position/')[1].split('.jpg')[0];
    var parseAnswer = filelist[rand[pick]].split('.jpg')[0];
    var soundname = 'sounds/sound_' + parseAnswer + '.wav';
    pick = pick + 1;
  
    var data = {
      htmlImage : imageData,
      imgList : filelist,
      soundURL : soundname,
      filename : parseAnswer,
      ans : pick
    };
  
    res.send(data);
});


router.get('/', function(request, response) {   // get : 라우팅 , path마다 적당한 응답 
    var scriptData = `<script type="text/javascript" src="train_size.js"></script>
    <script type="text/javascript" src="test_size.js"></script>`
    var figureData =`<div class="ui container" id="shape_list"><div class="ui four cards">`
    
    var cnt=0;
    for( var i=1 ; i<=4; i++) 
    {
        for(var j=1;j<=4;j++){
          cnt++;
          if(cnt==15) break;
          figureData = figureData + `
          <div class="grey card" style="cursor:pointer">
          <div class="image">
              <img src="/images/shapes/list${cnt}.jpg" onclick="loadFile(${cnt});">
          </div>
          </div>`
        }
    }
    figureData += `</div></div>`

    var activeData = 
    `<a href="/" class="item">위치</a>
    <a href="/size" class="active item">크기</a>
    <a href="/user" class="item">사용자파일</a>
    <a href="/united" class="item">통합</a>
    <a href="/camera" class="item">카메라</a>
    `

    var html = template.HTML(
        scriptData, activeData,
        figureData
    );
    response.send(html);
});


module.exports = router;