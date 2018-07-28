$(function(){
  "use strict";
  $.ajax({url: "./src/variable.js", dataType: "script", async: false});
  $.ajax({url: "./src/functions.js", dataType: "script", async: false});
  $.ajax({url: "./src/keyevent.js", dataType: "script", async: false});

  function gameLoop(){
    if(pos_y >= 400){ return; }
    update();
    draw();
  };

  setInterval(gameLoop, 500);
});
