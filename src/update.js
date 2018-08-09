// 関数（update関係）

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
    var length = eraseLine.length; // lengthを使ってスコアを計算
    // 消す行があるときはその処理
    if(length > 0){
      for(j = 0; j < length; j++){ Matrix.splice(eraseLine[length - j - 1], 1); }
      for(j = 0; j < length; j++){ Matrix.unshift([8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8]); }
      eraseLine = [];
      score += linescore[length];  // 1, 2, 3, 4に応じて得点を加算する
      if(Math.floor(lines / 10) < Math.floor((lines + length) / 10)){
        level += 1;
        fall_speed -= 1;
        if(level > 15){ level = 15; }
        if(fall_speed < 2){ fall_speed = 2; }
      }
      lines += length;  // スコアアタックでは消したライン数をカウントする。
    }
    // ブロックを再生成してPLAYに戻る
    makeBlock();
    state = PLAY;
  }
}

// テトリミノを作る
function makeBlock(){
  type = nextType;
  nextType = Math.floor(Math.random() * 7) + 1;  // 1～7の乱数を生成
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
