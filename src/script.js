$(function(){
  "use strict";
  $.ajax({url: "./src/variable.js", dataType: "script", async: false});
  $.ajax({url: "./src/draw.js", dataType: "script", async: false});
  $.ajax({url: "./src/update.js", dataType: "script", async: false});
  $.ajax({url: "./src/keyevent.js", dataType: "script", async: false});

  //init();  // この処理はいずれ、gameLoop内に移す（というかkeyevent内に移す。）
           // 内容がステージクリア、スコアアタックで微妙に違うので。
           // タイミングはSELECT→PLAYの遷移時。引数はモード変数（1とか2）

  function gameLoop(){
    update();
    draw();
  };

  setInterval(gameLoop, 20);
});
