const WebSocketServer = require('ws').WebSocketServer;
const { GameManager } = require('./GameManager');

const wss = new WebSocketServer({ port: 8081 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);
  ws.on('close', () => gameManager.removeUser(ws));

});
