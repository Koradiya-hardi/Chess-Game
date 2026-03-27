const { WebSocketServer } = require('ws');
const { GameManager } = require('./GameManager');

const PORT = process.env.PORT || 8081;

const wss = new WebSocketServer({ port: PORT });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);

  ws.on('close', () => gameManager.removeUser(ws));
});

console.log("WebSocket server running on port", PORT);