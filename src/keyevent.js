// キーイベント関連

document.addEventListener("keydown", keyDownHandler, false);

// 十字キーの右で右移動、左で左移動、上で回転、下で強制落下。
function keyDownHandler(e){
    if(e.keyCode == 39){　slide(1);　} // 右キー（右移動）
    else if(e.keyCode == 37){ slide(-1); } // 左キー（左移動）
    else if(e.keyCode == 38){ // 上キー（回転）
      if(rollable()){
        phase = (phase + 1) % 4;
        setBlock();
      }
    }else if(e.keyCode == 40){ frame = fall_speed; } // 下キー（落下）
    else if(e.keyCode == 32){ // スペースキー（ポーズ、ポーズ解除）
      if(state == PAUSE){ state = PLAY; }
      else if(state == PLAY){ state = PAUSE; }
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
    for(k = 0; k < 4; k++){ if(Matrix[ty[k]][tx[k] - 1] > 0){ return; }}
    for(k = 0; k < 4; k++){ tx[k]--; }
  }
}

// 回転可能かどうか調べる関数（true, falseを返す）
function rollable(){
  if(type == 7){ return true; }
  var a = tx[0];
  var b = ty[0];
  if(type < 4){
    var q = (phase + 1) % 2;
    if(type == 1){
      return (Matrix[b - 1 + a][a - q] == 0) && (Matrix[b + 1 - q][a + q] == 0) && (Matrix[b + 2 * (1 - q)][a + 2 * q] == 0);
    }
    if(type == 2){
      return (Matrix[b][a + 1 - 2 * q] == 0) && (Matrix[b - 1 + 2 * q][a + 1] == 0);
    }
    if(type == 3){
      return (Matrix[b - 1 + 2 * q][a] == 0) && (Matrix[b + 1][a + 1 - 2 * q] == 0);
    }
  }
  if(type < 7){
    // typeをtyって書いてた（信じられない）
    var q = (phase + 1) % 4;  // qは次の位相
    if(Matrix[b + dy[q]][a + dx[q]] > 0 || Matrix[b - dy[q]][a - dx[q]] > 0){ return false; }
    if(type == 4){
      return Matrix[b - dx[q] - dy[q]][a + dy[q] - dx[q]] == 0;
    }
    if(type == 5){
      return Matrix[b + dx[q] - dy[q]][a - dx[q] - dy[q]] == 0;
    }
    if(type == 6){
      return Matrix[b - dx[q]][a + dy[q]] == 0;
    }
  }
}
