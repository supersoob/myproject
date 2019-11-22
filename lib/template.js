
module.exports = {
    HTML:function(change_script, active_page, shape_list, list_name){
      list_name = typeof list_name !== 'undefined' ? list_name : "학습도형";
      return `<!doctype html>
      <html>
      <head>
      
          <link rel="stylesheet"  type="text/css" href="style.css">
          <link href="https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap" rel="stylesheet">
          <script src="http://code.jquery.com/jquery-latest.js"></script>
          
          <title class="font">ETRI SSD 학습기</title>    
          <link rel="stylesheet" type="text/css" href="semantic/semantic.css">
          <script src="semantic/semantic.js"></script>
          
        
      </head>
      <head>
          <meta charset="utf-8">
      </head>
      <style>
      .ui.container {
        height: 120px;
        overflow-x: hidden;
        text-align: center;
        
      }
      .box {
        height: 120px;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        display: flex;
        align-items: center;
      }
      </style>
      <body>
        ${change_script}
          <style> .centered { display: table; margin-left: auto; margin-right: auto; width: 80%;} </style>
          <div class="centered">
          <div class="ui inverted menu"> 
          <div class="header item">ETRI SSD 학습기</div>
          <div class="right menu">
              <a class="active blue item" id="train">TRAIN</a>
              <a class="red item" id="test">TEST</a>
          </div>
          </div>
              <div class="ui grid">
                      <div class="four wide column">
                      <div class="ui large vertical menu">
                            ${active_page}
                      </div>
                        </div>                      
                      <div class="twelve wide stretched column">
                      <div class="ui segment" id="seg_dim">
                      <div class="ui inverted dimmer">
                      <div class="ui huge text loader">Loading</div></div>
                            <div class="ui top attached green progress" id="example2">
                            
                            </div>
                              <div class="ui middle aligned four column grid">
                                      <div class="row" id="test_area">
                                              <div class="right aligned five wide column">
                                                      <button class="ui left labeled icon button" id="prev_button" disabled='disabled'>
                                                              <i class="left arrow icon"></i>
                                                              Prev
                                                        </button>
                                              </div>
                                              <div class="six wide column">
                                              <div class="centered two column">
                                              <img class ="ui middle aligned centered medium image" src ="/images/noimage.png" id=main_image style="width:250px;height:250px">
                                              </div>
                                              <input type="hidden" id="hiddencount" name="count" value="0">
                                              </div>
                                              <div class="left aligned five wide column">
                                                      <button class="ui right labeled icon button" id="next_button" disabled='disabled'>
                                                              <i class="right arrow icon"></i>
                                                              Next
                                                        </button>
                                                  </div> 
                                          </div>
                                      <div class="row">
                                          <div class="five wide column"></div>
                                          <div class = "six wide column">
                                          <audio autoplay controls id="player" type="audio/wav">
                                          </audio>
                                          </div>
                                          <div class="five wide column" id="make_next_bt"></div>
                                      </div>
                                      </div>
                                      
                                      <div class="ui divider"></div>
                              <div class="ui four column grid">
                                      <div class="row">
                                      <div class="eight wide column">
                                          <h5 class="ui top attached header" id="list_name">
                                                  ${list_name}
                                          </h5>
                                          <div class="ui attached segment">
                                          
                                          ${shape_list}
                                          
                                          </div>
                                      </div>
                                      <div class="column">
                                          <h5 class="ui top attached header">
                                                  결과
                                          </h5>
                                          <div class="ui attached segment">
                                          <div class="box" id="show_answer">도형을 골라주세요.
                                          </div></div>
                                      </div>
                                      <div class="column">
                                          <h5 class="ui top attached header">
                                                  점수
                                          </h5>
                                          <div class="ui attached segment">
                                            <div class="box" id="show_score">
                                            <div>
                                          </div>
                                          </div>
                                      </div>
                                      </div>
                              </div>
                      </div>
                    </div>
                </div>
          </div>
      </body>
      </html>`;
    },
    random : function lottoNum (len) {
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
}