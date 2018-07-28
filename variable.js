var canvas = $('canvas')[0];       // $('canvas')[0] でやるとDOM要素：getContext等が使える
var myCanvas = $('#myCanvas');     // $('#myCanvas')でやるとタグ要素：cssをいじったりできる
var ctx = canvas.getContext("2d"); // context要素

// canvas.heightで高さが出る

var tiles = new Image();
tiles.src = "./images/TILES.png";  // タイル要素

var blank = new Image();
blank.src = "./images/BLANK.png";  // ブランク

var pos_x = 120;  // タイルのx座標
var pos_y = 20;  // タイルのy座標
var tilecolor = 3;  // タイルの色

var board = new Image();
board.src = "./images/board.png";  // ボード

var score = 0; // スコア（初期値は0）
var level = 0; // レベル（初期値は0）
