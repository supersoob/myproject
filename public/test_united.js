var imageURL=`unitedImg/`;
var answer = null;
var imgList = null;
var ansImgURL = null;

$(function() {
    
    $("#test").on('click',function() {
        document.getElementById("player").src=null;
                
        var imageData=``;

        for(var i=1;i<=4;i++){
            imageData += 
            `<div class="column">
            <div class="ui grey card" width="100%" height="100%" style="cursor:pointer">
            <canvas id="canvas${i}" width="250px" height="250px" onclick="matchAnswer(${i})">
            </canvas>
            </div></div>
            `
        }

        $("#shape_list")[0].innerHTML=`<div class="box">TEST 진행중</div>`;
        $("#test_area")[0].innerHTML=imageData;
        
        ('#example2')[0].innerHTML=`<div class="bar"></div>`;
        $('#example2').progress({
            percent: 0
        });

        $("#shape_list")[0].innerHTML=`<div class="box">TEST 진행중</div>`;
        $("#show_score")[0].innerHTML=`
        <input type="hidden" id="score" name="score" value="0">
        <h3 class="ui huge header" id="update_score">0 / 100</h3>`;

        
        answer = generateRandom(1,4);

        for(var i=1;i<=4;i++){
            var caseURL = cvs(i, answer);
        }
       
    });
});

function matchAnswer(case_num){

    
    document.getElementById("player").pause();
    document.getElementById("player").currentTime = 0;
    
    // 고른답 정답인지 확인
    console.log(answer, case_num);
    if(parseInt(answer) == parseInt(case_num)){
        var sc = $("#score").attr("value");
        sc = parseInt(sc)+10;
        console.log("newsc : " + sc);
        $("#score").attr("value",sc);
        $("#update_score")[0].innerHTML = sc + ` / 100`;
        $("#show_answer")[0].innerHTML = `<img src= 'test/yes.png'>`;
    }

    else{
        $("#show_answer")[0].innerHTML = `<div class="image"><img src= 'test/no.png'></div>`;
    }

    //정답확인에 정답이미지 넣기
    var ansSrc = imageURL + 'image.png';
    $("#shape_list")[0].innerHTML = `
    <div class="centered two column">
    <img class ="ui middle aligned centered medium image" src ="${ansSrc}"
    style="width:120px;height:120px">
    </div>`
    
    //보기 누를 때 소리재생
    for(var i=1;i<=4;i++){
        $(`#canvas${i}`).attr('onclick', '').unbind('click');
    }

    //next 버튼 생성
    if($("#example2").progress('get percent')<100) {
        $("#make_next_bt")[0].innerHTML = `<button class="ui blue button" id="next_test">테스트 계속 진행</button>`;
    }
    
    $("#next_test").click(function() {
        document.getElementById("player").src=null;
        $("#make_next_bt")[0].innerHTML = ``;
        $("#shape_list")[0].innerHTML=`<div class="box">TEST 진행중</div>`;
        $("#show_answer")[0].innerHTML = `정답을 골라주세요.`;
        var curpercent = $("#example2").progress('get percent') + 10;
        $('#example2').progress({
            percent: curpercent
        });

        answer = generateRandom(1,4);

        for(var i=1;i<=4;i++){
            $(`#canvas${i}`).attr('onclick', `matchAnswer(${i})`);
            var caseURL = cvs(i, answer);
        }

    });

}
/*
function play_case(case_num){
    var audio = document.getElementById(`audio${case_num}`);
    audio.play();
}
*/


function cvs(case_num, answer){
    var canvas = document.getElementById(`canvas${case_num}`);
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
            var img1 = ele;
            var rand1 = Math.random()+0.38;
            if(rand1< 0.7) rand1 = 0.7;
            var arr1 = position(lot[cnt++]+1, img1.width, img1.height, rand1);
            ctx.drawImage(img1, arr1[0], arr1[1], img1.width * rand1, img1.height * rand1);
            if(cnt == tiles.length && case_num==answer) {
                ansImgURL = $(`#canvas${case_num}`)[0].toDataURL();

                $('#seg_dim').dimmer('show', function(onShow){
                    $.ajax({
                        url: 'python/mixed',
                        method: 'post',
                        data: ansImgURL,
                        processData: false,
                        contentType: false,
                        success: function(res) {
                            $('#seg_dim').dimmer('hide');
                            console.log(res);
                            var soundURL='unitedImg/hificode.wav?t=' + new Date().getTime();
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