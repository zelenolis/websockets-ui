import WebSocket, { WebSocketServer } from 'ws';
import { primaryParse, regParse, addToRoomParse, simpleDataParse } from './utils/parser.js';
import { serverUsers, updWinners } from './main/main.js';
import { serverRooms, updateRooms } from './main/rooms.js';
import { serverGames, finishCheck, getGameIdByPlayer } from './main/game.js';
import { shipsPlacement } from './main/gameBot.js'

const connectionIds = new Map();
let ind = 0;
const botId = 1000000000;

export const newSocket = () => {

    const gameWebSocket = new WebSocketServer({port: 3000});

    gameWebSocket.on('connection', (connection, req) => {

        const ip = req.socket.remoteAddress;

        console.log(`Connected ${ip}`);

        connection.on('message', (message) => {

            // incoming log:
            const incoming = message.toString();
            //console.log('Received: ' + incoming);

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
                if (!gamePair) { return }
                const gameInd = serverGames.newGame(gamePair[0], gamePair[1]);
                sendGame(gamePair[0], gamePair[1], gameInd)
                allConnectionsSend(updateRooms());

            } else if (primaryData.type === "add_ships") {
                const shipsData = simpleDataParse(primaryData.data);
                const gameIsReady = serverGames.addShips(shipsData.gameId, shipsData.ships, shipsData.indexPlayer);
                if (gameIsReady) {
                    startGame(shipsData.gameId);
                } else {
                    return
                }                

            } else if (primaryData.type === "attack") {
                                
                const attackData = simpleDataParse(primaryData.data);
                const turn = serverGames.getTurn(attackData.gameId);
                const player = attackData.indexPlayer;
                if (turn !== player) {
                    sendTurn(attackData.gameId);
                    return;
                } else {
                    const processedAttack = serverGames.attack(attackData.gameId, attackData.x, attackData.y, attackData.indexPlayer);
                    sendAttack(attackData.gameId, processedAttack);
                    if (finishCheck(attackData.gameId)) {
                        sendFinish(attackData.gameId, attackData.indexPlayer);
                        return
                    } else {
                        sendTurn(attackData.gameId);
                        botTurn(attackData.gameId);
                    }
                }
                
            } else if (primaryData.type === "randomAttack") {
                const randAttackData = simpleDataParse(primaryData.data);
                const randomCoords = serverGames.getRandomShot(randAttackData.gameId, randAttackData.indexPlayer);
                const processedAttack = serverGames.attack(randAttackData.gameId, randomCoords.x, randomCoords.y, randAttackData.indexPlayer);
                sendAttack(randAttackData.gameId, processedAttack);
                if (finishCheck(randAttackData.gameId)) {
                    sendFinish(randAttackData.gameId, randAttackData.indexPlayer);
                    return
                } else {
                    sendTurn(randAttackData.gameId);
                }
                
            } else if (primaryData.type === "single_play") {
                const currentInd = getCurrentInd(connection);
                const gameInd = serverGames.newGame(currentInd, botId);
                sendGame(currentInd, botId, gameInd);
                serverGames.addShips(gameInd, shipsPlacement(), botId);
            }
  
        });

        connection.on('close', () => {
            console.log(`Disconnected ${ip}`);
            const dis = getCurrentInd(connection);
            checkWhoDisconnected(dis);
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

function sendGame (user1: number, user2: number, gameInd: number) {
    const data1 = JSON.stringify({ "idGame": gameInd, "idPlayer": 1 });
    const send1 = JSON.stringify({ "type": "create_game", "data": data1, "id": 0 });
    const data2 = JSON.stringify({ "idGame": gameInd, "idPlayer": 2 });
    const send2 = JSON.stringify({ "type": "create_game", "data": data2, "id": 0 });
    const conn1 = getCurrentConnection(user1);
    const conn2 = getCurrentConnection(user2);
    conn1.send(send1);
    if(user2 === botId) {
        return
    } else {
        conn2.send(send2);
    }   
}

function startGame (gameNumber: number) {
    const data1 = JSON.stringify({ ships: serverGames.getShips(gameNumber, 1), currentPlayerIndex: 1 });
    const data2 = JSON.stringify({ ships: serverGames.getShips(gameNumber, 2), currentPlayerIndex: 2 });
    const send1 = JSON.stringify({ type: "start_game", data: data1, "id": 0 });
    const send2 = JSON.stringify({ type: "start_game", data: data2, "id": 0 });
    const user1 = serverGames.getUsersId(gameNumber, 1);
    const user2 = serverGames.getUsersId(gameNumber, 2);
    const conn1 = getCurrentConnection(user1);
    const conn2 = getCurrentConnection(user2);
    conn1.send(send1);
    if(user2 === botId) {
        return
    } else {
        conn2.send(send2);
    }
    const data3 = JSON.stringify({ currentPlayer: 1 });
    const send3 = JSON.stringify({ type: "turn", data: data3, "id": 0 });
    conn1.send(send3);
    if(user2 === botId) {
        return
    } else {
        conn2.send(send3);
    }
}

function sendAttack (gameNumber: number, attackData: string) {
    const send = JSON.stringify({ type: "attack", data: attackData, "id": 0 });
    const user1 = serverGames.getUsersId(gameNumber, 1);
    const user2 = serverGames.getUsersId(gameNumber, 2);
    const conn1 = getCurrentConnection(user1);
    const conn2 = getCurrentConnection(user2);
    conn1.send(send);
    if(user2 === botId) {
        return
    } else {
        conn2.send(send);
    };
}

function sendTurn (gameNumber: number) {
    const newTurn = JSON.stringify({ currentPlayer: serverGames.getTurn(gameNumber) });
    const send = JSON.stringify({ type: "turn", data: newTurn, "id": 0 });
    const user1 = serverGames.getUsersId(gameNumber, 1);
    const user2 = serverGames.getUsersId(gameNumber, 2);
    const conn1 = getCurrentConnection(user1);
    const conn2 = getCurrentConnection(user2);
    conn1.send(send);
    if(user2 === botId) {
        return
    } else {
        conn2.send(send);
    }
}

function sendFinish(gameNumber: number, playerId: number, ) {
    const finishData = JSON.stringify({winPlayer: playerId});
    const send = JSON.stringify({ type: "finish", data: finishData, "id": 0 });
    const user1 = serverGames.getUsersId(gameNumber, 1);
    const user2 = serverGames.getUsersId(gameNumber, 2);
    const conn1 = getCurrentConnection(user1);
    const conn2 = getCurrentConnection(user2);
    conn1.send(send);
    if(user2 === botId) {
        return
    } else {
        conn2.send(send);
    }
}

function checkWhoDisconnected(disconnectedId: number) {
    const gameId = getGameIdByPlayer(disconnectedId);
    if (!gameId) {
        return
    } else {
        console.log(gameId.game, gameId.player);
        sendFinish(gameId.game, gameId.player);
    }
}

function botTurn(gameId: number) {

    const botTurn = serverGames.getTurn(gameId);
    if (botTurn === 2) {
        botAttack(gameId);
        if (finishCheck(gameId)) {
            sendFinish(gameId, botId);
            return
        } else {
            sendTurn(gameId);
        }
    } else {
        return
    }
}

function botAttack(gameId: number) {
    do {
        const randomCoords = serverGames.getRandomShot(gameId, botId);
        const processedAttack = serverGames.attack(gameId, randomCoords.x, randomCoords.y, botId);
        sendAttack(gameId, processedAttack);
    } while (serverGames.getTurn(gameId) === 2)
}