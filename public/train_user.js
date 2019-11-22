
$(document).on("mouseover",".ui.fluid.dropdown",function() {
    $('.ui.fluid.dropdown').dropdown({
        on:"hover",
        action: function (value, text) {
            if (value == "Delete"){
                console.log($($(this)[0].innerText));
                console.log(text);
                var filename = $(this)[0].innerText.split("\n")[0];
                console.log(filename);
                deleteFile(filename);
            }
        }
    }); 
});
$(document).on("click","#logout",function() {
    $('.ui.fluid.dropdown').dropdown({
        on:"hover",
        action: function (value, text) {
            if (value == "Delete"){
                console.log($($(this)[0].innerText));
                console.log(text);
                var filename = $(this)[0].innerText.split("\n")[0];
                console.log(filename);
                deleteFile(filename);
            }
        }
    }); 
});
$(function () {
    
    var obj = $("#dropzone");

    obj.on('dragenter', function (e) {
         e.stopPropagation();
         e.preventDefault();
         $(this).css('border', '2px solid #5272A0');
    });

    obj.on('dragleave', function (e) {
         e.stopPropagation();
         e.preventDefault();
         $(this).css('border', '2px dotted #8296C2');
    });

    obj.on('dragover', function (e) {
         e.stopPropagation();
         e.preventDefault();
    });

    obj.on('drop', function (e) {
         e.preventDefault();
         $(this).css('border', '2px dotted #8296C2');

         var files = e.originalEvent.dataTransfer.files;
         if(files.length < 1)
              return;

         F_FileMultiUpload(files, obj);
    });

    $('.ui.fluid.dropdown').dropdown({
        on:"hover",
        action: function (value, text) {
            if (value == "Delete"){
                console.log(text);
                var filename = $(this)[0].innerText.split("\n")[0];
                console.log(filename);
                deleteFile(filename);
            }
        }
    });

});

function joinform(){
    
    $('#list_name')[0].innerText = "Join";
    var form = 
    `
    <form class="ui mini form" method="post" action="user/join">
    <div class="inline field">
      <input type="text" name="userId" placeholder="Username">
    </div>
    <div class="inline field">
      <input type="password" name="userPw" placeholder="Password">
    </div>
    <div class="inline field">
        <input type="password" name="userPwRe" placeholder="Password-check">
    </div>
    <button class="ui mini button" type="submit">Submit</button>
    </form>
    </form>`

    document.getElementById("dropzone").innerHTML = form;
   // $(document.body).append(form);
   // return;
}

function F_FileMultiUpload(files, obj) {
    if(confirm(files.length + "개의 파일을 업로드 하시겠습니까?") ) {
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
           data.append('file', files[i]);
        }


        var url ="user/upload";
        $.ajax({
           url: url,
           method: 'post',
           data: data,
           dataType: 'json',
           processData: false,
           contentType: false,
           success: function(res) {

                console.log("응답신호 : " + res);
               var figureData = `<div class="ui middle aligned selection list">`;
                var i = 0;
                while(i < res.length){
                    figureData = figureData + 
                    `
                    
                    <div class="item">
                <div class="ui fluid dropdown">
                <div class="text"  style="width : 80%" onclick="loadFile('${res[i].filename}')">${res[i].filename}</div>
                <i class="dropdown icon"></i>
                <div class="menu" style="right: 0;left: auto;">
              <div class="item">Delete</div>
              <div class="item">Rename</div>
          </div>
              </div>
                </div>`;
                    i = i + 1;
                }
                figureData +=`</ul>`;
                document.getElementById("dropzone").innerHTML = figureData;
              // F_FileMultiUpload_Callback(res.files);
           },
           complete: function() {
               console.log("complete");
            }
        });
    }

}

// 파일 멀티 업로드 Callback
function F_FileMultiUpload_Callback(files) {
    for(var i=0; i < files.length; i++)
        console.log(files[i].file_nm + " - " + files[i].file_size);
}

function deleteFile(filename){
    
    console.log("delete file : " + filename);

    $.ajax({
        url: 'user/delete',
        method: 'post',
        data: filename,
        processData: false,
        contentType: false,
        success: function(res) {
            console.log(res);
            console.log("응답신호 : " + res);
            var figureData = `<div class="ui middle aligned selection list">`;
             var i = 0;
             while(i < res.length){
                 figureData = figureData + 
                 `
                 <div class="item">
                 <div class="ui fluid dropdown">
                 <div class="text"  style="width : 80%" onclick="loadFile('${res[i].filename}')">${res[i].filename}</div>
                 <i class="dropdown icon"></i>
                 <div class="menu" style="right: 0;left: auto;">
               <div class="item">Delete</div>
           <div class="item">Rename</div>
            </div>
            </div>
             </div>`;
                 i = i + 1;
             }
             figureData +=`</ul>`;
             document.getElementById("dropzone").innerHTML = figureData;
     
        }
    });

}


function loadFile(filename){
    //학습 이미지 올려놓기
    var imageURL='uploads/image/'+ filename;
    console.log("로딩되는 파일 : ", filename);

    
    $("#main_image").attr("src",imageURL);

    $('#seg_dim').dimmer('show', function(onShow){
    
        var soundname = filename.split('.')[0] + '.wav';
        $.ajax({
            url: 'whatthe',
            method: 'post',
            data: filename,
            async: false,
            processData: false,
            contentType: false,
            success: function(res) {
                console.log(res);
                $('#seg_dim').dimmer('hide');
                var soundURL=`uploads/sound/${soundname}`;
                $("#player").attr("src",soundURL);
            }
    });
});
    
}