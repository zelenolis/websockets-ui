import WebSocket, { WebSocketServer } from 'ws';

export const newSocket = () => {

    const gameWebSocket = new WebSocketServer({port: 3000});

    gameWebSocket.on('connection', (connection, req) => {
        const ip = req.socket.remoteAddress;
        console.log(`Connected ${ip}`);
        connection.on('message', (message) => {
        console.log('Received: ' + message);
        for (const client of gameWebSocket.clients) {
            if (client.readyState !== WebSocket.OPEN) continue;
            if (client === connection) continue;
            client.send(message, { binary: false });
        }
        });
        connection.on('close', () => {
        console.log(`Disconnected ${ip}`);
        });
    });
    
}

