var canvas = $('canvas')[0];       // $('canvas')[0] でやるとDOM要素：getContext等が使える
var myCanvas = $('#myCanvas');     // $('#myCanvas')でやるとタグ要素：cssをいじったりできる
var ctx = canvas.getContext("2d"); // context要素

var tiles = new Image();
tiles.src = "./images/TILES.png"  // タイル要素

var blank = new Image();
blank.src = "./images/BLANK.png"  // ブランク

var pos_x = 0;  // タイルのx座標
var pos_y = 0;  // タイルのy座標
var tilecolor = 3;  // タイルの色
