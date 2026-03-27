"use strict";

var WebSocketServer = require('ws').WebSocketServer;

var _require = require('./GameManager'),
    GameManager = _require.GameManager;

var wss = new WebSocketServer({
  port: 8081
});
var gameManager = new GameManager();
wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);
  ws.on('close', function () {
    return gameManager.removeUser(ws);
  });
});