"use strict";

var _require = require('ws'),
    WebSocketServer = _require.WebSocketServer;

var _require2 = require('./GameManager'),
    GameManager = _require2.GameManager;

var PORT = process.env.PORT || 8081;
var wss = new WebSocketServer({
  port: PORT
});
var gameManager = new GameManager();
wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);
  ws.on('close', function () {
    return gameManager.removeUser(ws);
  });
});
console.log("WebSocket server running on port", PORT);