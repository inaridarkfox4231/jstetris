// キーイベント関連

document.addEventListener("keydown", keyDownHandler, false);

// 十字キーの右で右移動、左で左移動、上で回転、下で強制落下。
function keyDownHandler(e){
    if(e.keyCode == 39){ slide(1);
    }else if(e.keyCode == 37){ slide(-1);
    }else if(e.keyCode == 38){
      if(rollable()){
        phase = (phase + 1) % 4;
        setBlock();
      }
    }
}

// diffが1なら右移動、-1なら左移動
function slide(diff){
  if(diff > 0){
    for(k = 0; k < 4; k++){ if(tx[k] >= 10){ return; }}
    for(k = 0; k < 4; k++){ if(Matrix[ty[k]][tx[k] + 1] > 0){ return; }}
    for(k = 0; k < 4; k++){ tx[k]++; }
  }else{
    for(k = 0; k < 4; k++){ if(tx[k] <= 1){ return; }}
    for(k = 0; k < 4; k++){ if(Matrix[ty[k]][tx[k] - 1]) > 0{ return; }}
    for(k = 0; k < 4; k++){ tx[k]--; }
  }
}
