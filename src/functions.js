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
  //makeBlock();
}

// アップデート関数
function update(){
  // PLAYの時は落とすかどうか判定する、落としたときにFREEZEに行くかどうか判定。
  if(state == PLAY){
    frame += 1;
    if(frame > FALL_SPEED){
      frame = 0;
      check();  // 落とせるなら落とす、でなければFREEZEにする
    }
  }
  // FREEZEの時は必要なら行消ししてそれからブロック生成などしてPLAYに戻る
  if(state == FREEZE){
    if(eraseLine.length > 0){
      var p = eraseLine[0];
      for(j = 0; j < eraseLine.length; j++){ Matrix.splice(p, 1); }
      for(j = 0; j < eraseLine.length; j++){ Matrix.unshift([8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8]); }
      eraseLine = [];
    }
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
        drawtile(20 * (i - 1) + 120, 20 * j - 60, type);
      }
    }
  }
  // PLAYの場合はテトリミノを描画する
  if(state == PLAY){
    for(k = 0; k < 4; k++){
      if(ty[k] > 3){
        drawtile(20 * (tx[k] - 1) + 120, 20 * ty[k] - 60, type);
      }
    }
  }
  // FREEZEの場合は行が消えるアニメーションを展開する
  if(state == FREEZE){
    if(frame > 0){
      frame++;
      if((frame / 4) % 2 == 0){
        for(k = 0; k < eraseLine.length; k++){
          var p = eraseLine[k];
          ctx.drawImage(blank, 120, p * 20 - 60);
        }
      }
    }
    if(frame > 64){ frame = 0; }
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
    ty[1] = ty[0] + dy[phase]; ty[2] = ty[0] - dy[phase]; return;
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

// 回転可能かどうか調べる関数（true, falseを返す）
function rollable(){
  if(type == 7){ return true; }
  var a = tx[0];
  var b = ty[0];
  if(type < 4){
    var q = (phase + 1) % 2;
    if(type == 1){
      return Matrix[b - 1 + a][a - q] == 0 && Matrix[b + 1 - q][a + q] == 0 && Matrix[b + 2 * (1 - q)][a + 2 * q] == 0;
    }
    if(type == 2){
      return Matrix[b][a + 1 - 2 * q] == 0 && Matrix[b - 1 + 2 * q][a + 1] == 0;
    }
    if(type == 3){
      return Matrix[b - 1 + 2 * q][a] == 0 && Matrix[b + 1][a + 1 - 2 * q] == 0;
    }
  }
  if(type < 7){
    q = (phase + 1) % 4;  // qは次の位相
    if(Matrix[b + dy[q]][a + dx[q]] > 0 || Matrix[b - dy[q]][a - dx[q]] > 0){ return false; }
    if(ty == 4){
      return Matrix[b - dx[q] - dy[q]][a + dy[q] - dx[q]] == 0;
    }
    if(ty == 5){
      return Matrix[b + dx[q] - dy[q]][a - dx[q] - dy[q]] == 0;
    }
    if(ty == 6){
      return Matrix[b - dx[q]][a + dy[q]] == 0;
    }
  }
}

// 落とせるなら落とす、落とせないならFREEZEにする
function check(){
  for(k = 0; k < 4; k++){
    if(Matrix[ty[k] + 1][tx[k]] > 0){  // 落とせない場合（1マス下が埋まってる）
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
