var change = false;

$(function(){
    $('#seg_dim').dimmer('show', function(onShow){
        var conn = setInterval(function(){
            console.log(change);
            if(change == false) connect();
        }, 6000);
    });
});

function connect(){
    console.log("conn!");
    change = true;
    $.ajax({
        url: 'camera/reload',
        method: 'post',
        async: false,
        processData: false,
        contentType: false,
        success: function(res) {
            var image = document.getElementById("cam");
            console.log("save done");
            image.onload = function(){
                console.log("upload done");
                $('#seg_dim').dimmer('hide');
                $.ajax({
                    url: 'python/webcam',
                    method: 'post',
                    processData: false,
                    contentType: false,
                    success: function(res) {
                        console.log(res); 
                        change = false;
                        var soundURL='webcode.wav?t=' + new Date().getTime();
                        $("#player").attr("src",soundURL);   
                    }
                });
            }
            
            image.src = "web.png?t=" + new Date().getTime();
        },
        complete:function(){
        }
    });
}