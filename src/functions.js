// 関数関連

// タイルを部分的に取り出す関数
function drawtile(x, y, color){
  // (x, y)の位置にcolor色のタイルを置く
  // 1~7で色を指定（青、赤、橙、黄緑、紫、緑、茶色）
  ctx.drawImage(tiles, 20 * color, 0, 20, 20, x, y, 20, 20);
};

// 初期化
function init(){
  // 両端を8にして判定に使う（jを回してi++やってしまった。。）
  for(j = 0; j < 25; j++){ Matrix[j][0] = 8; Matrix[j][11] = 8; }
  // 最下段を8にして判定に使う
  for(i = 0; i < 12; i++){ Matrix[24][i] = 8; }
  makeBlock();
}

// アップデート関数
function update(){
  // PLAYの時は落とすかどうか判定する、落としたときにFREEZEに行くかどうか判定。
  if(state == PLAY){
    frame += 1;
    if(frame > fall_speed){
      frame = 0;
      check();  // 落とせるなら落とす、でなければFREEZEにする
    }
  }
  // FREEZEの時は必要なら行消ししてそれからブロック生成などしてPLAYに戻る
  if(state == FREEZE && frame == 0){
    // 上まで積みあがったらGAMEOVERにして抜ける
    if(Matrix[4][5] > 0 || Matrix[4][6] > 0){
      state = GAMEOVER;
      frame++; return;
    }
    var length = eraseLine.length;
    // 消す行があるときはその処理
    if(length > 0){
      var p = eraseLine[0];
      for(j = 0; j < length; j++){ Matrix.splice(p, 1); }
      for(j = 0; j < length; j++){ Matrix.unshift([8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8]); }
      eraseLine = [];
    }
    // ブロックを再生成してPLAYに戻る
    makeBlock();
    state = PLAY;
  }
}

// 描画関数
function draw(){
  ctx.drawImage(board, 60, 10); // ボードで初期化
  // 配置済みのタイルを描画する
  for(j = 4; j < 24; j++){
    for(i = 1; i < 11; i++){
      if(Matrix[j][i] > 0){
        drawtile(20 * (i - 1) + 70, 20 * j - 60, Matrix[j][i]);
      }
    }
  }
  // PLAY又はPAUSEの場合はテトリミノを描画する
  if(state == PLAY || state == PAUSE){
    for(k = 0; k < 4; k++){
      if(ty[k] > 3){
        drawtile(20 * (tx[k] - 1) + 70, 20 * ty[k] - 60, type);
      }
    }
  }
  // PAUSEの場合はポーズフレーズを表示する
  if(state == PAUSE){
    ctx.drawImage(pauseText, 70, 200);
  }
  // FREEZEの場合は行が消えるアニメーションを展開する
  if(state == FREEZE){
    if(frame > 0){
      frame++;
      if((frame / 2) % 2 == 0){
        for(k = 0; k < eraseLine.length; k++){
          ctx.drawImage(blank, 70, eraseLine[k] * 20 - 60);
        }
      }
    }
    if(frame > 32){ frame = 0; }
  }
  // GAMEOVERのときはブロックを灰にしていって終わったらテキスト表示
  if(state == GAMEOVER){
    if(frame > 0){
      frame++;
      if(frame % 2 == 0){
        for(i = 1; i < 11; i++){
          if(Matrix[(frame / 2) + 3][i] > 0){ Matrix[(frame / 2) + 3][i] = 8; }
        }
      }
    }
    if(frame > 40){ frame = 0; }
    if(frame == 0){
      ctx.drawImage(gameoverText, 70, 200);
    }
  }
}

// テトリミノを作る
function makeBlock(){
  type = Math.floor(Math.random() * 7) + 1;  // 1～7の乱数を生成
  // 0番の位置の微調整
  if(type == 5){ tx[0] = 6;
  }else{ tx[0] = 5; }
  if(type == 1){ ty[0] = 2;
  }else if(type == 7){ ty[0] = 4; }
  else{ ty[0] = 3; }
  phase = 0;
  setBlock(); // typeとphaseをもとにしてテトリミノをセット。
}

// typeとphaseをもとに、tx, tyのデータを決定ないし更新する
function setBlock(){
  if(type < 4){
    var q = phase % 2;
    if(type == 1){
      tx[1] = tx[0] - q; tx[2] = tx[0] + q; tx[3] = tx[0] + 2 * q;
      ty[1] = ty[0] - 1 + q; ty[2] = ty[0] + 1 - q; ty[3] = ty[0] + 2 * (1 - q);
      return;
    }
    if(type == 2){
      tx[1] = tx[0]; tx[2] = tx[0] + 1 - 2 * q; tx[3] = tx[0] + 1;
      ty[1] = ty[0] + 1; ty[2] = ty[0]; ty[3] = ty[0] - 1 + 2 * q;
      return;
    }
    if(type == 3){
      tx[1] = tx[0] + 1; tx[2] = tx[0]; tx[3] = tx[0] + 1 - 2 * q;
      ty[1] = ty[0]; ty[2] = ty[0] - 1 + 2 * q; ty[3] = ty[0] + 1;
      return;
    }
  }
  if(type < 7){
    tx[1] = tx[0] + dx[phase]; tx[2] = tx[0] - dx[phase];
    ty[1] = ty[0] + dy[phase]; ty[2] = ty[0] - dy[phase];
    if(type == 4){
      tx[3] = tx[0] + dy[phase] - dx[phase];
      ty[3] = ty[0] - dx[phase] - dy[phase]; return;
    }
    if(type == 5){
      tx[3] = tx[0] - dx[phase] - dy[phase];
      ty[3] = ty[0] + dx[phase] - dy[phase]; return;
    }
    if(type == 6){
      tx[3] = tx[0] + dy[phase];
      ty[3] = ty[0] - dx[phase]; return;
    }
  }
  if(type == 7){
    tx[1] = tx[0]; tx[2] = tx[0] + 1; tx[3] = tx[0] + 1;
    ty[1] = ty[0] - 1; ty[2] = ty[0]; ty[3] = ty[0] - 1; return;
  }
}

// 落とせるなら落とす、落とせないならFREEZEにする
function check(){
  for(k = 0; k < 4; k++){
    if(Matrix[ty[k] + 1][tx[k]] > 0){  // 落とせない場合（1マス下が埋まってる）
      //console.log("freeze");
      state = FREEZE;
      write();  // 書き込み
      eraseCheck(); // 行が消えるかどうかチェック
      return;
    }
  } // そうでなければ1マス落とす（kを回してi++やってしまった。。）
  for(k = 0; k < 4; k++){ ty[k]++; }
}

// 行列への書き込み操作
function write(){
  for(k = 0; k < 4; k++){
    if(ty[k] < 4){ Matrix[ty[k]][tx[k]] = 0;
    }else{ Matrix[ty[k]][tx[k]] = type; }
  }
}

// 行が消えるかどうかチェック
function eraseCheck(){
  var is_erasable;
  for(j = 4; j < 24; j++){
    is_erasable = true;
    for(i = 1; i < 11; i++){
      if(Matrix[j][i] == 0){ is_erasable = false; }
    }
    if(is_erasable){ eraseLine.push(j); }
  }
  if(eraseLine.length > 0){ frame += 1; }
}
