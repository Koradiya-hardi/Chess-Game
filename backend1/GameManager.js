

const { INIT_GAME, MOVE } = require('./messages');

const { Game } = require('./Game');

class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];

    }

    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        // Stop the game here because the user left
    }

    addHandler(socket) {
        socket.on('message', (data) => {
            console.log('Received message:', data.toString());

            let message;
            try {
                message = JSON.parse(data.toString());
            } catch (e) {
                console.error('Invalid JSON received:', data.toString());
                return;
            }

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                console.log('Inside move');
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log('Inside makeMove');
                    if (message.payload && message.payload.move) {
                        game.makeMove(socket, message.payload.move);
                    } else {
                        console.error('Invalid MOVE message payload:', message);
                    }
                }
            }
        });
    }
}

module.exports = { GameManager };


