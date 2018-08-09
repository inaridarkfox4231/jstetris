// 関数（draw関係）

// タイルを部分的に取り出す関数
function drawtile(x, y, color){
    // (x, y)の位置にcolor色のタイルを置く
    // 1~7で色を指定（青、赤、橙、黄緑、紫、緑、茶色）
    ctx.drawImage(tiles, 20 * color, 0, 20, 20, x, y, 20, 20);
};
// 数を部分的に取り出す関数
function drawnumber(x, y, n){
    // (x, y)の位置に数字n(0～9)を描画する
    ctx.drawImage(numbers, 18 * n, 0, 18, 30, x, y, 18, 30);
}
// レベル表示用（0, 1が1, 10の位）
function drawLVnum(s, n){
    drawnumber(131 - 18 * s, 440, n);
}
// スコア表示用（0, 1, 2, 3, 4, 5が1, 10, 10^2, 10^3, 10^4, 10^5の位）
function drawSCOREnum(s, n){
    drawnumber(203 - 18 * s, 470, n);
}
// ライン数表示用(0, 1, 2)
function drawLINESnum(s, n){
    drawnumber(302 - 18 * s, 440, n);
}

// 配置済みのタイルを描画する
function drawBase(){
    for(j = 4; j < 24; j++){
        for(i = 1; i < 11; i++){
            if(Matrix[j][i] > 0){
                drawtile(20 * (i - 1) + 40, 20 * j - 60, Matrix[j][i]);
            }
        }
    }
}

// 次に落ちてくるテトリミノをネクストボックスに描画する
function drawNext(){
    for(k = 0; k < 4; k++){
        tmp = nextTilePos[nextType][k]
        drawtile(280 + 20 * (tmp % 2), 20 + 20 * (tmp >> 1), nextType);
    }
}

// レベルを描画する
function drawLevel(){
    tmp = level;
    for(i = 0; i < 2; i++){
        drawLVnum(i, tmp % 10);
        tmp = Math.floor(tmp / 10);
    }
}

// スコアを描画する
function drawScore(){
    tmp = score;
    for(i = 0; i < 6; i++){
        drawSCOREnum(i, tmp % 10);
        tmp = Math.floor(tmp / 10);
    }
}

// ライン数を表示する
function drawLines(){
    tmp = lines;
    for(i = 0; i < 3; i++){
        drawLINESnum(i, tmp % 10);
        tmp = Math.floor(tmp / 10);
    }
}

// 描画関数
function draw(){
    // 黒で初期化
    ctx.drawImage(backGround, 0, 0);

    // タイトル画面の時
    if(state == TITLE){ draw_title(); return; }

    // セレクト画面の時
    if(state == SELECT){ draw_select(); return; }

    // タイトル画面, セレクト画面でなければステージを表示
    if(state != TITLE && state != SELECT){
        draw_stage();
    }

    // PLAY又はPAUSEの場合はテトリミノを描画する
    if(state == PLAY || state == PAUSE){
        for(k = 0; k < 4; k++){
            if(ty[k] > 3){
                drawtile(20 * (tx[k] - 1) + 40, 20 * ty[k] - 60, type);
            }
        }
    }
    // PAUSEの場合はポーズフレーズを表示する
    if(state == PAUSE){
        ctx.drawImage(pauseText, 40, 200);
    }

    // CLEARの時はクリアーフレーズを表示する
    if(state == CLEAR){
        if(level < 4){
            ctx.drawImage(clearText, 40, 200);
        }else{
            ctx.drawImage(allClearText, 40, 180);
        }
    }

    // FREEZEの場合は行が消えるアニメーションを展開する
    if(state == FREEZE){ freeze_anime(); }

    // GAMEOVERのときはブロックを灰にしていって終わったらテキスト表示
    if(state == GAMEOVER){ gameover_anime(); }
}

// ボードで初期化、スコアなどの用意
function draw_stage(){
    ctx.drawImage(gameBoard, 0, 0); // ゲームボードで初期化
    drawBase();  // 配置済みのタイルを描画
    drawNext();  // 次に落ちてくるテトリミノを描画
    drawLevel(); // レベル表示
    drawScore(); // スコア表示
    drawLines(); // ライン数表示
}

// タイトル画面の描画
function draw_title(){
    ctx.drawImage(logoText, 70, 110);
    ctx.drawImage(titlemesText, 45, 260);
}

// セレクト画面の描画(選択肢は白抜き)
function draw_select(){
    var kind = [0, 1, 2];
    kind[mode] += 3;
    ctx.drawImage(choicesText, 0, 30 * kind[0], 130, 30, 70, 140, 130, 30);
    ctx.drawImage(choicesText, 0, 30 * kind[1], 180, 30, 70, 220, 180, 30);
    ctx.drawImage(choicesText, 0, 30 * kind[2], 195, 30, 70, 270, 195, 30);
}

// FREEZEの時の行が消えるアニメーション
function freeze_anime(){
    if(frame > 0){
        frame++;
        if((frame >> 1) % 2 == 0){
            for(k = 0; k < eraseLine.length; k++){
                ctx.drawImage(blank, 40, eraseLine[k] * 20 - 60);
            }
        }
    }
    if(frame > 32){ frame = 0; }
}

// GAMEOVERの時のブロックが灰色になるアニメーション
function gameover_anime(){
    if(frame > 0){
        frame++;
        if(frame % 2 == 0){
            for(i = 1; i < 11; i++){
                if(Matrix[(frame >> 1) + 3][i] > 0){ Matrix[(frame >> 1) + 3][i] = 8; }
            }
        }
    }
    if(frame > 40){ frame = 0; }
    if(frame == 0){
        ctx.drawImage(gameoverText, 40, 200);
    }
}
