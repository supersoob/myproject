const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysqlDB = require('./mysql-db');
const sync = require('child_process').spawnSync;

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
router.post('/',async function(req,res){
    var post = JSON.stringify(req.body);
    console.log("받은 파일 이름 : " + post.split('"')[1]);
    var ar = post.split('"')[1];

    var sqlquery = 'select sound from ' + req.session.userId + ' where filename="' + ar + '"';
    mysqlDB.query(sqlquery, function (err, rows, fields) {
        console.log(rows);
        console.log(sqlquery);
        if(rows[0].sound==0){
            //var ar = encodeURI(post.split('"')[1]);
            var func_exec = sync('python', ['hificode_image.py', ar],
            {encoding:'utf8', cwd:'C:/Users/lsbhy/myproject/public/uploads/image/'});
            //var func_exec = execSync(`python hificode_image.py ${ar}`,
            //{encoding:'utf8', cwd:'C:/Users/lsbhy/myproject/public/uploads/image/'});
            //var func_exec = await pythonExec(ar);
            //console.log(func_exec);
            console.log(func_exec);
            mysqlDB.query(`update ${req.session.userId} set sound=1 where filename ="${ar}"`, function (err, rows, fields) {
              console.log(`update ${req.session.userId} set sound=1 where filename="${ar}"`);
            });
            res.send("python exec is done");
        }
        else{
          res.send("already exists");
        };
    });
});


module.exports = router;