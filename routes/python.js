const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysqlDB = require('./mysql-db');
var fs = require('fs');
const sync = require('child_process').spawnSync;
const { spawn } = require('child_process');
var sys = require('sys');
var NodeWebcam = require( "node-webcam" );

//const execSync = require('child_process').execSync;
/*
function pythonExec(ar) {
  return new Promise(function(resolve, reject) {
    resolve(exec(`python hificode_image.py ${ar}`,{cwd:'C:/Users/lsbhy/myproject/public/uploads/image/'}
     ,(error, stdout, stderr) => {
      return stdout;
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    }));
  });
}
*/

router.post('/webcam',function(req,res){
  console.log("webcam py");
  const func_exec = spawn('python', ['hificode_image.py','web.png'],
      {encoding:'utf8', cwd:__dirname + '\\..\\public\\'});

      func_exec.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      func_exec.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      func_exec.on('exit', (code) => {
        console.log(`child process exited with code ${code}`);
        res.send("python exec is done");
      });
});



router.post('/mixed',function(req,res){

  var img = JSON.stringify(req.body);
  //console.log(img);
  var data=img.slice(img.indexOf(',')+1).replace(/\s/g,'+');
  var buf = Buffer.from(data, 'base64'); 
  fs.writeFileSync(__dirname+'\\..\\public\\unitedImg\\image.png', buf);
  var func_exec = sync('python', ['hificode_image.py', "image.png"],
            {encoding:'utf8', cwd:__dirname+ "\\..\\public\\unitedImg\\"});
  res.send("python exec is done");
  
});

router.post('/check',function(req,res){

  console.log(req.body);

  var sqlquery = 'select sound from ' + req.session.userId + ' where filename=\"' + req.body + '\"';
  mysqlDB.query(sqlquery, function (err, rows, fields) {
    if(rows[0].sound==1){
      res.send("true");
    }
    else res.send("false");
  });

});

router.post('/',function(req,res){
    
    console.log("req.body : ", req.body);
    
    var filelist = req.body.split(',');

    console.log(filelist);
    
    filelist.forEach(function(ar){

      var sqlquery = 'select sound from ' + req.session.userId + ' where filename=\"' + ar + '\"';
      mysqlDB.query(sqlquery, function (err, rows, fields) {
          console.log(rows);
          console.log(sqlquery);
          if(rows[0].sound==0){
              //var func_exec = sync('python', ['hificode_image.py', ar],
              //{encoding:'utf8', cwd:'C:/Users/lsbhy/myproject/public/uploads/image/'});

              const func_exec = spawn('python', ['hificode_image.py', ar],
              {encoding:'utf8', cwd:'C:/Users/lsbhy/myproject/public/uploads/image/'});

              
              func_exec.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
              });

              func_exec.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
              });

              func_exec.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                var sql = 'UPDATE ' + req.session.userId + ' SET sound=1 WHERE filename=\"' + ar + '\"';
                console.log(sql);
                mysqlDB.query(sql, function (err, rows, fields) {
                  if(err) console.log(err);
                });
              });
          }
      });
  });

  res.send("python exec is done");
});

module.exports = router;