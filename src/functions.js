// 関数関連

function drawtile(x, y, color){
  // (x, y)の位置にcolor色のタイルを置く
  // 1~7で色を指定（青、赤、橙、黄緑、紫、緑、茶色）
  ctx.drawImage(tiles, 20 * color, 0, 20, 20, x, y, 20, 20);
};

function erasetile(x, y){
  ctx.drawImage(blank, x, y);
}

function update(){
  $('#level').text(level);
  $('#score').text(score);
}

function draw(){
  ctx.drawImage(board, 60, 10);
  pos_y += 20;  // 落とす
  drawtile(pos_x, pos_y, tilecolor);
}
