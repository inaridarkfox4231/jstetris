$(function(){
  "use strict";
  $.ajax({url: "./src/variable.js", dataType: "script", async: false});

  function drawtile(x, y, color){
    // (x, y)の位置にcolor色のタイルを置く
    // 1~7で色を指定（青、赤、橙、黄緑、紫、緑、茶色）
    ctx.drawImage(tiles, 20 * color, 0, 20, 20, x, y, 20, 20);
  };

  function erasetile(x, y){
    ctx.drawImage(blank, x, y);
  }

  function fall(){
    update();
    if(pos_y >= 400){ return; }
    erasetile(pos_x, pos_y);
    pos_y += 20;
    drawtile(pos_x, pos_y, tilecolor);
  };

  function update(){
    ctx.drawImage(board, 110, 10);
    $('#level').text(level);
    $('#score').text(score);
  }

  function sideMove(direction){
    if(direction > 0 && pos_x < 300){
      erasetile(pos_x, pos_y);
      pos_x += 20;
      drawtile(pos_x, pos_y, tilecolor);
    }
    if(direction < 0 && pos_x > 120){
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

  setInterval(fall, 300);
});
