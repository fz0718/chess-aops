'use strict';
var ROOM_ID = 971;
var START_B = [['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
               ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
               ['' , '' , '' , '' , '' , '' , '' , '' ],
               ['' , '' , '' , '' , '' , '' , '' , '' ],
               ['' , '' , '' , '' , '' , '' , '' , '' ],
               ['' , '' , '' , '' , '' , '' , '' , '' ],
               ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
               ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']];
var START_S = [[1, 1, 1, 1, 1, 1, 1, 1],
               [1, 1, 1, 1, 1, 1, 1, 1],
               [-1, -1, -1, -1, -1, -1, -1, -1],
               [-1, -1, -1, -1, -1, -1, -1, -1],
               [-1, -1, -1, -1, -1, -1, -1, -1],
               [-1, -1, -1, -1, -1, -1, -1, -1],
               [0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0]];

var white;
var black;
var turn;
var board;
var side;
var playing;

var q = [];
var w = App.getWindow(ROOM_ID);

var _doInput = w.doInput;
w.doInput = function doInput(s) {
  q.push(s);
}
setInterval(function() {
  if (q.length > 0) _doInput(q.shift());
}, 1100);

var _onPluginMessage = Classroom.socket.onPluginMessage;
Classroom.socket.onPluginMessage = function(payload) {
  if (playing) {
    if (payload.message && payload.message.startsWith('@chess')) {
      if ((payload.speaker === white && turn === 0) ||
          (payload.speaker === black && turn === 1)) {
        var r = parseMove(payload.message.substring(6).trim());
        if (r) {
          nextTurn();
        }
      }
      else {
        console.log('WRONG TURN: ' + payload.speaker);
      }
    }
  }
  _onPluginMessage(payload);
}

function sendFEN(s) {
  x = 'http://www.gilith.com/chess/diagrams/?f=' + s.replace(/\//g, '%2F') + '&s=create';
  y = 'http://www.gilith.com/chess/diagrams/images/' + s.replace(/\//g, '_') + '.png';
  $('<iframe src="' + x + '">').appendTo('body').load(function() {
    $(this).remove();
    w.doInput('[img]' + y + '[/img]');
  });
}

function sendBoard() {
  var fen = [];
  for (var i = 0; i < 8; ++i) {
    var c = [];
    var t = 0;
    for (var j = 0; j < 8; ++j) {
      if (board[i][j]) {
        if (t) {
          c.push(t);
          t = 0;
        }
        c.push(side[i][j] ? board[i][j].toLowerCase() : board[i][j]);
      }
      else {
        ++t;
      }
    }
    if (t) c.push(t);
    fen.push(c.join(''));
  }
  sendFEN(fen.join('/'));
}

function parseMove(m) {
  /* this is a basic variant, no checking yet */
  a, b = m.split(' ');
  return true;
}

function nextTurn() {
  turn = 1 - turn;
  sendBoard();
}

function play(player1, player2) {
  var t = Math.floor(Math.random() * 2);
  white = [player1, player2][t];
  black = [player2, player1][t];
  turn = 0;
  board = START_B;
  side = START_S;
  playing = true;
}

function stop() {
  playing = false;
}
