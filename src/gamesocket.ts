import WebSocket, { WebSocketServer } from 'ws';
import { primaryParse, regParse, addToRoomParse } from './utils/parser.js';
import { serverUsers, updWinners } from './main/main.js';
import { serverRooms, updateRooms } from './main/rooms.js'

const connectionIds = new Map();
let ind = 0;

export const newSocket = () => {

    const gameWebSocket = new WebSocketServer({port: 3000});

    gameWebSocket.on('connection', (connection, req) => {

        const ip = req.socket.remoteAddress;

        console.log(`Connected ${ip}`);

        connection.on('message', (message) => {

            // incoming log:
            const incoming = message.toString();
            console.log('Received: ' + incoming);
            //console.log(`req: ${req.toString()}`);
            //console.log(`socket: ${req.socket.toString()}`);
            //console.log(`connection: ${connection.toString()}`);

            // primary pasring
            const primaryData = primaryParse(incoming);

            if (primaryData.type === "reg") {
                connectionIds.set(++ind, connection);
                const regParsed = regParse(primaryData.data);
                const regResp = serverUsers.newUser(regParsed, ind);
                connection.send(regResp);
                allConnectionsSend(updWinners());
                allConnectionsSend(updateRooms());
            } else if (primaryData.type === "create_room") {
                const currentInd = getCurrentInd(connection);
                serverRooms.createRoom(currentInd);
                allConnectionsSend(updateRooms());
            } else if (primaryData.type === "add_user_to_room") {
                const currentInd = getCurrentInd(connection);
                const roomInd = addToRoomParse(primaryData.data);
                const gamePair = serverRooms.addToRoom(currentInd, roomInd);
                sendGame(gamePair[0], gamePair[1])
            } else if (primaryData.type === "create_game") {
                //
            } else if (primaryData.type === "update_room") {
                //
            }

            

            
/*
            for (const client of gameWebSocket.clients) {
                if (client.readyState !== WebSocket.OPEN) continue;
                if (client === connection) continue;
                console.log(`sending: ${message}`)
                client.send(message, { binary: false });
            }
*/
            
        });

        connection.on('close', () => {
        console.log(`Disconnected ${ip}`);
        });
    });

}

function allConnectionsSend (data: string) {
    connectionIds.forEach((c) => {
        c.send(data);
    })
}

function getCurrentInd (data: WebSocket) {
    for (let [key, value] of connectionIds.entries()) {
        if (value === data) { return key }
    }
    return null
}

function getCurrentConnection (data: number) {
    for (let [key, value] of connectionIds.entries()) {
        if (key === data) { return value }
    }
    return null
}

function sendGame (user1: number, user2: number) {
    const data1 = JSON.stringify({ "idGame": 1, "idPlayer": 1 });
    const send1 = JSON.stringify({ "type": "create_game", "data": data1, "id": 0 });
    const data2 = JSON.stringify({ "idGame": 1, "idPlayer": 2 });
    const send2 = JSON.stringify({ "type": "create_game", "data": data2, "id": 0 });
    const conn1 = getCurrentConnection(user1);
    const conn2 = getCurrentConnection(user2);
    conn1.send(send1);
    conn2.send(send2);
}