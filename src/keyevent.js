// キーイベント関連

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e){
    if(e.keyCode == 39) sideMove(1);
    else if(e.keyCode == 37) sideMove(-1);
}

function sideMove(direction){
  if(direction > 0 && pos_x < 250){
    erasetile(pos_x, pos_y);
    pos_x += 20;
    drawtile(pos_x, pos_y, tilecolor);
  }
  if(direction < 0 && pos_x > 70){
    erasetile(pos_x, pos_y);
    pos_x -= 20;
    drawtile(pos_x, pos_y, tilecolor);
  }
}
