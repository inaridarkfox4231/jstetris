// 変数関連

// 回す変数
var i, j, k, tmp;

var canvas = $('canvas')[0];       // $('canvas')[0] でやるとDOM要素：getContext等が使える
var myCanvas = $('#myCanvas');     // $('#myCanvas')でやるとタグ要素：cssをいじったりできる
var ctx = canvas.getContext("2d"); // context要素

// canvas.heightで高さが出る

var tiles = new Image();
tiles.src = "./images/TILES.png";  // タイル要素

var blank = new Image();
blank.src = "./images/BLANK.png";  // ブランク（横一列・・行消去に使う）

var gameBoard = new Image();
gameBoard.src = "./images/GAMEBOARD.png"; // ゲームボード

var pauseText = new Image();
pauseText.src = "./images/pause.png"; // ポーズテキスト
var gameoverText = new Image();
gameoverText.src = "./images/gameover.png";  // ゲームオーバーテキスト

var numbers = new Image();
numbers.src = "./images/NUMBER.png";  // 数のテキスト

// 次のテトリミノを表示する為のデータ
var nextTilePos = [[], [0, 2, 4, 6], [1, 2, 3, 4], [0, 2, 3, 5], [0, 1, 2, 4],
                       [0, 1, 3, 5], [0, 2, 3, 4], [2, 3, 4, 5]];
// スコア計算用
var linescore = [0, 1000, 3000, 5000, 10000];

var level = 1; // レベル（初期値は1, MAXで15の予定。ステージクリアは1, 5, 9, 13に。）
var score = 0; // スコア（初期値は0, 999999でカンストの予定。）
var lines = 0; // 消した行の数。あるいは、ステージクリアだとノルマに使ったり。

var Matrix = []; // 積み上げ状況(12×24で作る)
for(j = 0; j < 25; j++){
  Matrix.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

var tx = [0, 0, 0, 0];  // 落下するテトリミノのx座標(1～10)
var ty = [0, 0, 0, 0];  // 落下するテトリミノのy座標(0～23)（表示は4～23）
var phase = 0;  // フェイズ（回転用）
var type = 0;   // タイプ（テトリミノの形状：1～7）
var nextType = Math.floor(Math.random() * 7) + 1; // 次のテトリミノのタイプ（1～7）
const dx = [0, -1, 0, 1];   // x方向のベクトル(xは横方向)
const dy = [1, 0, -1, 0];   // y方向のベクトル(yは縦方向)

var fall_speed = 16 // 落下スピード（フレーム数がこれを超えると1落ちる）
var frame = 0;  // フレーム数

var eraseLine = [] // 消去する行の番号を格納する

// State定数
const START = 0;
const PLAY = 1;
const PAUSE = 2;
const FREEZE = 3;
const GAMEOVER = 4;
const CLEAR = 5;
var state = PLAY;
