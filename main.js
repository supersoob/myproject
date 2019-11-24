const express = require('express');
const fs = require('fs');
const app = express();       // express는 함수, app는 객체
const port = 3000;
var template = require('./lib/template.js');
var bodyParser = require('body-parser');

var sizeRouter = require('./routes/size');
var userRouter = require('./routes/user');
var pythonRouter = require('./routes/python');
var unitedRouter = require('./routes/united');

var session = require('express-session');

app.use(session({
  key: 'sid',
  secret: 'etri1234',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use('/user',userRouter);
app.use('/size', sizeRouter);
app.use('/python', pythonRouter);
app.use('/united', unitedRouter);




app.get('/', function(request, response) {   // get : 라우팅 , path마다 적당한 응답 

    var scriptData = `<script type="text/javascript" src="train_position.js"></script>
        <script type="text/javascript" src="test_position.js"></script>`

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
    `<a href="/" class="active item">위치</a>
    <a href="/size" class="item">크기</a>
    <a href="/user" class="item">사용자파일</a>
    <a href="/united" class="item">통합</a>
    <a class="item">카메라</a>
    `

    var html = template.HTML(
        scriptData,activeData,
        figureData
    );
    response.send(html);
});


app.post('/test', function(req,res){

  
  var post = req.body.filedir;
  var filedir = './public/' + post;

  var imageData = ``
  /*
  var file = fs.readFileSync(`./public/test/pos_filelist`,"utf8");
  var filelist = file.split('\n');
  var len = filelist.length-1;
  */

  var filelist = fs.readdirSync(filedir,"utf8");
  console.log(filelist);
  var len = filelist.length;
  var rand = template.random(len);
 
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



app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
  
});                         // 3000번 포트에 웹서버 열어줌

