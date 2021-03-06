var imageURL=`uploads/image`;
var answer = null;
var imgList = null;
var ansFilename = null;

$(function() {
    
    $("#test").on('click',function() {
        $.ajax({
            type:"POST",
            url : "user/test",
            data : {filedir : imageURL},
            success: function(res){        
                console.log(res);

                if(res=="-1") {alert("오류 발생 (테스트 케이스 부족)");history.go(-1);}

                else{
                answer = res.ans;
                ansFilename = res.filename;
                imgList = res.imgList;
                $("#player").attr("src",res.soundURL);
                $("#test_area")[0].innerHTML=res.htmlImage;
                console.log(res.soundURL);
                $("#list_name")[0].innerHTML="정답 확인";
                        
                $('#example2')[0].innerHTML=`<div class="bar"></div>`;
                $('#example2').progress({
                    percent: 0
                });

                $("#dropzone")[0].innerHTML=`<div class="box">TEST 진행중</div>`;
                $("#show_answer")[0].innerHTML = `정답을 골라주세요.`;
                $("#show_score")[0].innerHTML=`
                <input type="hidden" id="score" name="score" value="0">
                <h3 class="ui huge header" id="update_score">0 / 100</h3>`;
                }
            },
            error: function(xhr, status, error) {
                alert(error);
            }
        });
        
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
    var ansSrc = imageURL + '/' + ansFilename;
    $("#dropzone")[0].innerHTML = `
    <div class="centered two column">
    <img class ="ui middle aligned centered medium image" src ="${ansSrc}"
    style="width:120px;height:120px">
    </div>`


    //보기 누를 때 소리재생
    for(var i=1;i<=4;i++){
        $(`#case_image${i}`).attr("onclick", `play_case(${i})`);
    }

    //next 버튼 생성
    if($("#example2").progress('get percent')<100) {
        $("#make_next_bt")[0].innerHTML = `<button class="ui blue button" id="next_test">테스트 계속 진행</button>`;
    }
    
    $("#next_test").click(function() {
        
            
        $("#make_next_bt")[0].innerHTML = ``;
        $("#dropzone")[0].innerHTML=`<div class="box">TEST 진행중</div>`;
        $("#show_answer")[0].innerHTML = `정답을 골라주세요.`;
        var curpercent = $("#example2").progress('get percent') + 10;
        $('#example2').progress({
            percent: curpercent
        });
        reloadImg();
    });

}

function play_case(case_num){
    var audio = document.getElementById(`audio${case_num}`);
    audio.play();
}

function reloadImg(){
    
    // 다음 데이터 갱신
    var len = imgList.length;
    var rand = lottoNum(len);
    console.log(rand);
   
    for(var i=1;i<=4;i++){
        var parseName = imgList[rand[i-1]].filename.split('.')[0];
        var soundSrc = 'uploads/sound/' + parseName + '.wav';
        $(`#case_image${i}`).attr("src", imageURL + "/" + imgList[rand[i-1]].filename);
        $(`#case_image${i}`).attr("onclick", `matchAnswer(${i})`);
        $(`#audio${i}`).attr("src",soundSrc);
    }
  
    var pick = Math.floor(Math.random()*4);
    ansFilename = imgList[rand[pick]].filename;
    $("#player").attr("src", "uploads/sound/" + ansFilename.split('.')[0] + ".wav");
    answer = pick + 1;
    console.log(answer);

}


function lottoNum (len) {
    let lotto = [];
    let i = 0;
    while (i < 4) {
    let n = Math.floor(Math.random() * len) ;
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

