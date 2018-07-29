// キーイベント関連, クリックイベント関連

document.addEventListener("keydown", keyDownHandler, false);
canvas.addEventListener("click", clickHandler, false);

// 十字キーの右で右移動、左で左移動、上で回転、下で強制落下。
function keyDownHandler(e){
    if(e.keyCode == 39 && state == PLAY){　slide(1);　} // 右キー（右移動）
    else if(e.keyCode == 37 && state == PLAY){ slide(-1); } // 左キー（左移動）
    else if(e.keyCode == 38 && state == PLAY){ // 上キー（回転）
      if(rollable()){
        phase = (phase + 1) % 4;
        setBlock();
      }
    }else if(e.keyCode == 40 && state == PLAY){ // 下キー（落下）
       frame = fall_speed;
       score += 5;   // 強制落下で+5点
     }
    else if(e.keyCode == 32){ // スペースキー（ポーズ、ポーズ解除）
      if(state == PAUSE){ state = PLAY; }
      else if(state == PLAY){ state = PAUSE; }
    }else if(e.keyCode == 13){ // エンターキーはゲームオーバーからのリセットに使う
      if(state == GAMEOVER){
        state = PLAY;
        reset();  // リセット処理
      }
    }
}

// クリックでパッドを操作した時の挙動について
function clickHandler(e){
  var x, y;
  var rect = e.target.getBoundingClientRect();
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  if(x < 260 || y < 120){ return; }
  if(state == PLAY){
    if(270 < x && x < 330 && 140 < y && y < 180){
      if(rollable()){ phase = (phase + 1) % 4; setBlock(); }
    }
    if(260 < x && x < 300 && 200 < y && y < 240){ slide(-1); }
    if(300 < x && x < 340 && 200 < y && y < 240){ slide(1); }
    if(270 < x && x < 330 && 260 < y && y < 300){ frame = fall_speed; }
  }
  if(270 < x && x < 330 && 320 < y && y < 360 && state == GAMEOVER){
    state = PLAY; reset();
  }
  if(270 < x && x < 330 && 380 < y && y < 420){
    if(state == PLAY){ state = PAUSE; }
    else if(state == PAUSE){ state = PLAY; }
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

// リセット処理
function reset(){
  level = 1;
  score = 0;
  lines = 0;
  fall_speed = 16;
  nextType = Math.floor(Math.random() * 7) + 1; // nextも初期化する
  for(j = 0; j < 24; j++){
    for(i = 1; i < 11; i++){
      Matrix[j][i] = 0;
    }
  }
}
