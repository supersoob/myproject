var fs=require('fs');
var data = "";

for(var i=1;i<=15;i++){

    var filelist = fs.readdirSync(`../images/shapes/VOICEDATA/${i}/size/`);
        //console.log(filelist[0]);

    filelist.forEach(function(file){
        var hey = `images/shapes/VOICEDATA/${i}/size/` + file;
        // console.log(hey);
        fs.appendFileSync("size_filelist",hey+"\n", "utf8");
    });
}
