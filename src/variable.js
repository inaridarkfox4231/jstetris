// 変数関連

// 回す変数
var i, j, k;

var canvas = $('canvas')[0];       // $('canvas')[0] でやるとDOM要素：getContext等が使える
var myCanvas = $('#myCanvas');     // $('#myCanvas')でやるとタグ要素：cssをいじったりできる
var ctx = canvas.getContext("2d"); // context要素

// canvas.heightで高さが出る

var tiles = new Image();
tiles.src = "./images/TILES.png";  // タイル要素

var blank = new Image();
blank.src = "./images/BLANK.png";  // ブランク（横一列・・行消去に使う）

var board = new Image();
board.src = "./images/BOARD.png";  // ボード

var score = 0; // スコア（初期値は0）
var level = 0; // レベル（初期値は0）

var Matrix = []; // 積み上げ状況(12×24で作る)
for(j = 0; j < 25; j++){
  Matrix.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

var tx = [0, 0, 0, 0];  // 落下するテトリミノのx座標(1～10)
var ty = [0, 0, 0, 0];  // 落下するテトリミノのy座標(0～23)（表示は4～23）
var phase = 0;  // フェイズ（回転用）
var type = 0;   // タイプ（テトリミノの形状：1～7）
const dx = [0, -1, 0, 1];   // x方向のベクトル(xは横方向)
const dy = [1, 0, -1, 0];   // y方向のベクトル(yは縦方向)

var fall_speed = 16; // 落下スピード（フレーム数がこれを超えると1落ちる）
var frame = 0;  // フレーム数

var eraseLine = [] // 消去する行の番号を格納する

// State定数
const START = 0;
const PLAY = 1;
const PAUSE = 2;
const FREEZE = 3;
const GAMEOVER = 4;
var state = PLAY;
