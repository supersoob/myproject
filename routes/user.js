const express = require('express');
var router = express.Router();
var path = require('path');
var qs = require('querystring');
var template = require('../lib/template.js');
var mysqlDB = require('./mysql-db');
var bodyParser = require('body-parser');
var fs = require('fs');

let multer = require('multer');

var _storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, 'public/uploads/image/')  
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) 
  }
})
var upload = multer({storage: _storage }) 


// python 코드 연결 후 .wav 생성
router.post('/upload',upload.array("file"),function(req,res){
  var filelist = fs.readdirSync("public/uploads/image/");
  var post = req.files;

  post.forEach(function(element){
      var currfile = element.originalname;

      var sqlquery = 'insert into ' + req.session.userId + ' values("'+ currfile + '"' + ', 0)';
      mysqlDB.query(sqlquery, function (err, rows, fields) {});
  });

  var sqlquery2 = 'select * from ' + req.session.userId;
  mysqlDB.query(sqlquery2, function (err, rows, fields) {
      var resp = new Object();
      resp.file = rows;
      resp.new = post;
      
      res.send(resp);
  });
});

router.post('/delete', function(req, res) {
  var post = req.body;
  var imageURL='public/uploads/image/'+ post;
  var soundURL='public/uploads/sound/'+ post.split('.')[0] + '.wav';
  console.log(post);

  fs.unlink(imageURL, (err) => {
    if (err) throw err;
    console.log(imageURL + ' was deleted');
  });

  fs.stat(soundURL, function(err, stats) {
    if(!err){
      fs.unlink(soundURL, (err) => {
        if (err) throw err;
        console.log(soundURL + ' was deleted');
      });
    }
  });

  var sqlquery = `delete from ${req.session.userId} where filename="${post}"`
  mysqlDB.query(sqlquery, function (err, rows, fields) {});
  
  var sqlquery2 = `select filename from ${req.session.userId}`
  mysqlDB.query(sqlquery2, function (err, rows, fields) {
    res.send(rows);
  });
});


router.post('/test', function(req,res){

  if(req.session.userId){
  var sqlquery = 'select filename from ' + req.session.userId + ' where sound=1';
  mysqlDB.query(sqlquery, function (err, rows, fields) {

      var imageData = ``
      var len = rows.length;
      var rand = template.random(len);
      console.log(rand);
  
      for(var i=1;i<=4;i++){
          var parseName = rows[rand[i-1]].filename.split('.')[0];
          var soundSrc = 'uploads/sound/' + parseName + '.wav';
      
          imageData += 
          `<div class="column">
          <div class="ui grey card" style="cursor:pointer">
                  <div class="image">
                  <img src ="${'uploads/image/' + rows[rand[i-1]].filename}" id="case_image${i}" onclick="matchAnswer(${i})">
                  <audio id="audio${i}" src="${soundSrc}" ></audio>
                  </div>
          </div></div>
          `
      }
    
      var pick = Math.floor(Math.random()*4);
      var parseAnswer = rows[rand[pick]].filename;
      var soundname = 'uploads/sound/' + parseAnswer.split('.')[0] + '.wav';
      pick = pick + 1;
    
      var data = {
        htmlImage : imageData,
        imgList : rows,
        soundURL : soundname,
        filename : parseAnswer,
        ans : pick
      };
    
      res.send(data);
    
    });
  }
});

router.get('/', function(req, res) {   // get : 라우팅 , path마다 적당한 응답 
      var scriptData = `<script type="text/javascript" src="train_user.js"></script>
      <script type="text/javascript" src="test_user.js"></script>`

      //drag & drop
      var uploadFolder = "public/uploads/image/";

      var activeData = 
      `<a href="/" class="item">위치</a>
      <a href="/size" class="item">크기</a>
      <a href="/user" class="active item">사용자파일</a>
      <a href="/united" class="item">통합</a>
      <a href="/camera" class="item">카메라</a>
      `
      var figureData=`<div class="ui centered container" id="dropzone">`

      if(req.session.userId) {
          var userId = req.session.userId;
          console.log("로그인된 아이디 : " + userId);
          mysqlDB.query('select * from ' + userId ,function(err,rows,fields){

            if(rows.length==0){           
              figureData +=`<div class="box">Drag & Drop Files Here</div>`;
            }
            else{
              figureData += `<div class="ui middle aligned selection list">`;
              var i = 0;
              while(i < rows.length){
                figureData = figureData + 
                `
                <div class="browse item">
                <div class="ui fluid dropdown">
                <div class="text" style="width : 80%" onclick="loadFile('${rows[i].filename}')">${rows[i].filename}</div>
                <i class="dropdown icon"></i>
                <div class="menu" style="right: 0;left: auto;">
                <div class="item">Delete</div>
                <div class="item">Rename</div>
                 </div>
                </div>
                </div>
                
                `;
                i = i + 1;
              }
              figureData +=`</div>`;
            }
            figureData +=`</div>`;
            var html = template.HTML(
              scriptData, activeData, figureData,`<form action="user/logout" method="GET">
              ${req.session.userId}님의 파일리스트
              <button class="compact ui right floated mini button" type="submit">
              Logout
              </button>
              </form>`
            );
            res.send(html);
          });
      }

      else{

        figureData += `
        <form class="ui mini form" name="loginform" method="POST">
        <div class="inline field">
          <input type="text" id="userId" name="userId" placeholder="Username">
        </div>
        <div class="inline field">
          <input type="password" id="userPw" name="userPw" placeholder="Password">
        </div>
        <button class="ui mini button" type="submit">Submit</button>
        <button class="ui mini button" onclick="joinform()">Join</button>
        </form>`
        figureData+=`</div>`;

        
        var html = template.HTML(
        scriptData, activeData, figureData, "Login"
        );
        res.send(html);
      }
});

router.post('/', function (req, res, next) {
  var userId = req.body['userId'];
  var userPw = req.body['userPw'];

  mysqlDB.query('select * from users where id=\'' + userId + '\' and pw=\'' + userPw + '\'', function (err, rows, fields) {
      if (!err) {
          if (rows[0]!=undefined) {
            console.log(rows);
            req.session.userId = req.body['userId']; req.session.save(function(){res.redirect('/user');});
          }
          else {
            res.send('<script>alert("일치하는 회원정보가 없습니다.");history.go(-1);</script>');
          }
      } else {
          res.send('<script>alert("오류 발생");history.go(-1);</script>');
      }
  });
});

router.post('/join', function (req, res, next) {
  var userId = req.body['userId'];
  var userPw = req.body['userPw'];
  var userPwRe = req.body['userPwRe'];
  if(userId.length<4 || userPw.length<4) res.send('<script>alert("아이디와 비밀번호의 길이는 4이상 입니다.");history.go(-1);</script>');
  else if (userPw == userPwRe) {
      mysqlDB.query('insert into users values(?,?)', [userId, userPw], function (err, rows, fields) {
          if (err) {
              res.send('<script>alert("중복된 아이디 입니다.");history.go(-1);</script>');
          }
      });
      mysqlDB.query(`create table ${userId} (filename varchar(255) primary key not null, sound bool not null)`, [userId, userPw], function (err, rows, fields) {
        if (!err) {
            res.redirect('/user');
        } else {
            res.send('<script>alert("오류 발생");history.go(-1);</script>');
        }
    });
  }else{
      res.send('<script>alert("password not match!");history.go(-1);</script>');
  }
});

router.get('/logout', function(req, res){
  delete req.session.userId;
  req.session.save(function(){res.redirect('/user');});
});

module.exports = router;