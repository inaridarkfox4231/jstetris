$(function(){
  "use strict";
  $.ajax({url: "./variable.js", dataType: "script", async: false});

  function drawtile(x, y, color){
    // (x, y)の位置にcolor色のタイルを置く
    // 1~7で色を指定（青、赤、橙、黄緑、紫、緑、茶色）
    ctx.drawImage(tiles, 20 * color, 0, 20, 20, x, y, 20, 20);
  };

  function erasetile(x, y){
    ctx.drawImage(blank, x, y);
  }

  function fall(){
    erasetile(pos_x, pos_y);
    pos_y += 20;
    if(pos_y >= canvas.height){ return; }  // canvas.heightで高さ。
    drawtile(pos_x, pos_y, tilecolor);
  };

  function sideMove(direction){
    if(direction > 0 && pos_x < 360){
      erasetile(pos_x, pos_y);
      pos_x += 20;
      drawtile(pos_x, pos_y, tilecolor);
    }
    if(direction < 0 && pos_x > 0){
      erasetile(pos_x, pos_y);
      pos_x -= 20;
      drawtile(pos_x, pos_y, tilecolor);
    }
  }
  document.addEventListener("keydown", keyDownHandler, false);

  function keyDownHandler(e){
      if(e.keyCode == 39) sideMove(1);
      else if(e.keyCode == 37) sideMove(-1);
      else if(e.keyCode == 13) tilecolor = (tilecolor % 7 + 1);
  }

  setInterval(fall, 500);
});
