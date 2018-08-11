// キーイベント関連, クリックイベント関連

document.addEventListener("keydown", keyDownHandler, false);
canvas.addEventListener("click", clickHandler, false);

// 十字キーの右で右移動、左で左移動、上で回転、下で強制落下。
function keyDownHandler(e){
    if(state == SELECT){
      // セレクト画面での処理は別立て
      if(e.keyCode == K_UP){  // 上キーで上に
        mode -= 1;
        if(mode < 0){ mode = 2; }
      }else if(e.keyCode == K_DOWN){  // 下キーで下に
        mode += 1;
        if(mode > 2){ mode = 0; }
      }
    }

    if(e.keyCode == K_RIGHT && state == PLAY){　slide(1);　} // 右キー（右移動）
    else if(e.keyCode == K_LEFT && state == PLAY){ slide(-1); } // 左キー（左移動）
    else if(e.keyCode == K_UP && state == PLAY){ // 上キー（回転）
      if(rollable()){
        phase = (phase + 1) % 4;
        setBlock();
      }
    }else if(e.keyCode == K_DOWN && state == PLAY){ // 下キー（落下）
       frame = fall_speed;
       score += 5;   // 強制落下で+5点
     }
    else if(e.keyCode == K_SPACE){ // スペースキー(ポーズ)
      if(state == PAUSE){
         state = PLAY;        // ポーズ状態のON/OFF
       }else if(state == PLAY){
          state = PAUSE;
        }
    }else if(e.keyCode == K_ENTER){ // エンターキー(状態遷移)
      if(state == TITLE){
        state = SELECT;  // タイトル画面からエンターでセレクト画面に。
      }else if(state == SELECT){
        if(mode == 0){
          state = TITLE;  // modeが0の場合はタイトルに戻る。
        }else{
          state = PLAY; init();   // ここで初期化(modeにより処理を分ける)
        }
      }else if(state == GAMEOVER){
        state = TITLE;   // タイトルに戻る
        reset();  // リセット処理
      }else if(state == CLEAR){
        // レベル＜４ならinit()してPLAYに戻る。
        // レベル＝４ならタイトルに戻してリセット。
        if(mode == 1){
          if(level < 4){ state = PLAY; init(); }
          else{ state = TITLE; reset(); }
        }
      }
    }
}

// クリックでパッドを操作した時の挙動について
function clickHandler(e){
  if(state == TITLE){ state = SELECT; return; }  // タイトルからはセレクトに行くだけ。
  var x, y;
  var rect = e.target.getBoundingClientRect();
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;

  if(state == SELECT){
      // クリック位置に応じてmodeの変更と実行処理。
      if(70 < x && x < 200 && 140 < y && y < 170){ mode = 0; state = TITLE; }
      if(70 < x && x < 250 && 220 < y && y < 250){ mode = 1; state = PLAY; init(); }
      if(70 < x && x < 265 && 270 < y && y < 300){ mode = 2; state = PLAY; init(); }
      return;
  }

  if(x < 260 || y < 120){ return; }
  // 以下はプレイ中の処理
  if(state == PLAY){
    if(270 < x && x < 330 && 140 < y && y < 180){  // 上キー(回転)
      if(rollable()){ phase = (phase + 1) % 4; setBlock(); }
    }
    if(260 < x && x < 300 && 200 < y && y < 240){ slide(-1); } // 左
    if(300 < x && x < 340 && 200 < y && y < 240){ slide(1); }  // 右
    if(270 < x && x < 330 && 260 < y && y < 300){  // 下キー(落下)
       frame = fall_speed;
       score += 5;  // 強制落下で+5点
    }
  }
  if(270 < x && x < 330 && 380 < y && y < 420){  // スペースキー
    if(state == PLAY){ state = PAUSE; }
    else if(state == PAUSE){ state = PLAY; }
  }
  if(270 < x && x < 330 && 320 < y && y < 360){  // エンターキー
    if(state == GAMEOVER){
      state = TITLE;   // タイトルに戻る
      reset();  // リセット処理
    }else if(state == CLEAR){
      // レベル＜４ならinit()してPLAYに戻る。
      // レベル＝４ならタイトルに戻してリセット。
      if(mode == 1){
        if(level < 4){ state = PLAY; init(); }
        else{ state = TITLE; reset(); }
        }
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
  level = 0;
  score = 0;
  lines = 0;
  mode = 0;  // モード変数を0に戻す
  fall_speed = 16;
  nextType = Math.floor(Math.random() * 7) + 1; // nextも初期化する
  for(j = 0; j < 24; j++){
    for(i = 1; i < 11; i++){
      Matrix[j][i] = 0;
    }
  }
}

// タイトル画面はエンター押すかどっかクリックするとSELECT
// セレクト画面は上下のキーでチョイス、エンターで実行、変数が変わる。
// もしくは項目をクリックしても遷移してPLAYに行く。
// GAMEOVERからはTITLEに行くように変更。
// CLEARからは次のステージに行く（スコア持ち越し）か、TITLEに戻るか。
