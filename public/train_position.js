function loadFile(list_num){
    //학습 이미지 올려놓기
    var imageURL=`images/shapes/VOICEDATA/${list_num}/position/img${list_num}_mv0.jpg`;
    //console.log(imageURL);
    var soundURL=`sounds/sound_img${list_num}_mv0.wav`;
    $("#main_image").attr("src",imageURL);
    $("#player").attr("src",soundURL);
    $("#next_button").removeAttr("disabled");
    $("#hiddencount").attr("value","0");
}


$(function() {
    $('.ui.inverted.menu a.item').on('click', function() { 
      $(this)
        .addClass('active')
        .siblings()
        .removeClass('active'); 
    })
    $("#train").attr("href","/");
       
    $("#prev_button")
      .click(function() { 
        //이미지 갱신
        var hiddenCount = parseInt($("#hiddencount").attr("value")) - 1;
        console.log(hiddenCount);
        $("#hiddencount").attr("value", hiddenCount.toString());
         
        var currImage = $("#main_image").attr("src").split("_")[0];
        currImage += "_mv" + hiddenCount.toString()+ ".jpg";
        console.log(currImage);
        $("#main_image").attr("src",currImage);

        
        //사운드 갱신
        var currSound = $("#player").attr("src").split("_mv")[0];
        currSound += "_mv" +hiddenCount.toString()+".wav";
        console.log(currSound);
        $("#player").attr("src",currSound);


        //버튼 동작 조정
        if(hiddenCount<=0) $("#prev_button").attr("disabled","disabled");
        else{
            $("#next_button").removeAttr("disabled");
        }
    });
    $("#next_button")
      .click(function() { 
        //이미지 갱신
        var hiddenCount = parseInt($("#hiddencount").attr("value")) + 1;
        console.log(hiddenCount);
        $("#hiddencount").attr("value", hiddenCount.toString());
        
        var currImage = $("#main_image").attr("src").split("_")[0];
        currImage += "_mv" + hiddenCount.toString()+ ".jpg";
        console.log(currImage);
        $("#main_image").attr("src",currImage);

        //사운드 갱신
        var currSound = $("#player").attr("src").split("_mv")[0];
        currSound += "_mv" +hiddenCount.toString()+".wav";
        console.log(currSound);
        $("#player").attr("src",currSound);

        //버튼 동작 조정
        if(hiddenCount>=8) $("#next_button").attr("disabled","disabled");
        else{
            $("#prev_button").removeAttr("disabled");
        }
      });
});