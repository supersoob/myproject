$(function () {
    python();
});


function python(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,250,250);

    var tiles=[];
    
    var it = generateRandom(1,4);

    for(var x=0;x<it;x++){
        var imgObj= new Image();
        var randImg = generateRandom(1,11);
        imgObj.src = "unitedImg/shape" + randImg + ".jpg";
        tiles.push(imgObj);
    }
    
    var lot = lottoNum(it);

    var cnt=0;
    tiles.forEach(function(ele){
        ele.onload = function(){
            console.log(ele);
            var img1 = ele;
            var rand1 = Math.random()+0.38;
            if(rand1< 0.7) rand1 = 0.7;
            var arr1 = position(lot[cnt++]+1, img1.width, img1.height, rand1);
            console.log(rand1, arr1[0], arr1[1]);
            ctx.drawImage(img1, arr1[0], arr1[1], img1.width * rand1, img1.height * rand1);
            console.log(cnt, tiles.length);
            if(cnt == tiles.length) {
                var imageURL = $("#canvas")[0].toDataURL();
                console.log(imageURL);

                $('#seg_dim').dimmer('show', function(onShow){
                    $.ajax({
                        url: 'python/mixed',
                        method: 'post',
                        data: imageURL,
                        processData: false,
                        contentType: false,
                        success: function(res) {
                            $('#seg_dim').dimmer('hide');
                            console.log(res);
                            var soundURL=`unitedImg/hificode.wav`;
                            $("#player").attr("src",soundURL);
                        }
                    });
                });
            }
        }
    });
}

function position(index, w, h, rand){
    let arr = [];
    console.log(index);

    if(index==1){
        var randx = generateRandom(0,125-(w*rand));
        var randy = generateRandom(0,125-(h*rand));
        arr.push(randx);
        arr.push(randy);
    }
    else if(index==2){
        var randx = generateRandom(125,250-(w*rand));
        var randy = generateRandom(0,125-(h*rand));
        arr.push(randx);
        arr.push(randy);
    }
    else if(index==3){
        var randx = generateRandom(0,125-(w*rand));
        var randy = generateRandom(125,250-(h*rand));
        arr.push(randx);
        arr.push(randy);
    }
    else if(index==4){
        var randx = generateRandom(125,250-(w*rand));
        var randy = generateRandom(125,250-(h*rand));
        arr.push(randx);
        arr.push(randy);
    }

    return arr;
}

var generateRandom = function (min, max) {
    var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
    return ranNum;
}

function lottoNum (len) {
    let lotto = [];
    let i = 0;
    while (i < len) {
    let n = Math.floor(Math.random() * 4) ;
    if (notSame(n)) {
    lotto.push(n);
    i++;
    }
    }
    function notSame (n) {
        return lotto.every((e) => n !== e);
    }
    return lotto;
}