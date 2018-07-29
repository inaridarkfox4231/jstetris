$(function(){
  "use strict";
  $.ajax({url: "./src/variable.js", dataType: "script", async: false});
  $.ajax({url: "./src/draw.js", dataType: "script", async: false});
  $.ajax({url: "./src/update.js", dataType: "script", async: false});
  $.ajax({url: "./src/keyevent.js", dataType: "script", async: false});

  init();
  function gameLoop(){
    update();
    draw();
  };

  setInterval(gameLoop, 20);
});
