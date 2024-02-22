import { GamesArray, Ship } from "../data/interfaces.js";
import { serverUsers } from "./main.js";

let ind = 0;

const games: GamesArray[] = [];

class Games {
    public newGame (pl1: number, pl2: number) {
        const newGame = {
            turn: 1,
            gameId: ++ind,
            player1: 1,
            player1Ind: pl1,
            player2: 2,
            player2Ind: pl2,
            ships1: [],
            ships2: [],
            filed1: [],
            filed2: []
        }
        games.push(newGame);
        return newGame.gameId;
    }

    public addShips (gameIndex: number, ships: Ship[], gamePlayerIndex: number) {
        const currentGame = games.filter(e => e.gameId === gameIndex);
        
        if (gamePlayerIndex === 1) {
            currentGame[0].ships1.push(...ships);
        } else {
            currentGame[0].ships2.push(...ships);
        }
        if (currentGame[0].ships1.length > 0 && currentGame[0].ships2.length > 0) {
            //game ready
            return true
        } else {
            //waiting for a players
            return false
        }
    }

    public getShips (gameInd: number, gamePlayerIndex: number) {
        const currentGame = games.filter(e => e.gameId === gameInd);

        if (gamePlayerIndex === 1) {
            return currentGame[0].ships1
        } else {
            return currentGame[0].ships2
        }
    }

    public getUsersId (gameInd: number, gamePlayerIndex: number) {
        const currentGame = games.filter(e => e.gameId === gameInd);

        if (gamePlayerIndex === 1) {
            return currentGame[0].player1Ind
        } else {
            return currentGame[0].player2Ind
        }
    }

    public getTurn (gameInd: number) {
        const currentGame = games.filter(e => e.gameId === gameInd);
        return currentGame[0].turn;
    }

    public attack(gameInd: number, xCoord: number, yCoord: number, shootingPlayerId: number) {
        const currentGame = games.filter(e => e.gameId === gameInd);

        let currentShips: Ship[];
        let shipStatus: string;

        if (shootingPlayerId === 1) {
            currentShips = currentGame[0].ships2;
            currentGame[0].filed1.push({x: xCoord, y: yCoord});
        } else {
            currentShips = currentGame[0].ships1;
            currentGame[0].filed2.push({x: xCoord, y: yCoord});
        }

        for (let ship of currentShips) {
            const shipX = ship.position.x;
            const shipY = ship.position.y;
            const direction = ship.direction;
            const shipLength = ship.length
            let hits = ship.hits ?? 0;
            if (!direction) {
                if (shipX <= xCoord && xCoord < (shipX + shipLength) && shipY === yCoord) {
                    hits +=1;
                    if (hits >= ship.length) {
                        ship.hits = hits;
                        shipStatus = "killed";
                        const killedCells = getKilledCellsX(gameInd, xCoord, yCoord, shipX, shipY, shipLength, shootingPlayerId);
                        return  killedCells;                
                    } else {
                        ship.hits = hits;
                        shipStatus = "shot";
                        return [JSON.stringify({ "position": { x: xCoord, y: yCoord, }, "currentPlayer": shootingPlayerId, "status": shipStatus })];
                    }                    
                }
            } else {
                if (shipY <= yCoord && yCoord < (shipY + shipLength) && shipX === xCoord) {
                    hits +=1;
                    if (hits >= ship.length) {
                        ship.hits = hits;
                        shipStatus = "killed";
                        const killedCells = getKilledCellsY(gameInd, xCoord, yCoord, shipX, shipY, shipLength, shootingPlayerId);
                        return  killedCells;
                    } else {
                        ship.hits = hits;
                        shipStatus = "shot";
                        return [JSON.stringify({ "position": { x: xCoord, y: yCoord, }, "currentPlayer": shootingPlayerId, "status": shipStatus })];
                    }    
                }
            }
        }

        shipStatus = "miss";
        nextTurn(gameInd);
        return [JSON.stringify({ "position": { x: xCoord, y: yCoord, }, "currentPlayer": shootingPlayerId, "status": shipStatus })];
        
    }

    public getRandomShot(gameInd: number, shootingPlayerId: number) {
        const currentGame = games.filter(e => e.gameId === gameInd);

        let randCoords: {x: number, y: number};

        if (shootingPlayerId === 1) {
            const currentShoots = currentGame[0].filed1;
            do {
                randCoords = randomCoords();
            } while (currentShoots.some(obj => matchCoords(randCoords.x, randCoords.y, obj.x, obj.y)));
        } else {
            const currentShoots = currentGame[0].filed2;
            do {
                randCoords = randomCoords();
            } while (currentShoots.some(obj => matchCoords(randCoords.x, randCoords.y, obj.x, obj.y)));
        }
        return randCoords
    }

    public checkRepeatAttack(x: number, y: number, gameInd: number, shootingPlayerId: number) {
        const currentGame = games.filter(e => e.gameId === gameInd);
        if (shootingPlayerId === 1) {
            const currentShoots = currentGame[0].filed1;
            if (currentShoots.some(obj => matchCoords(x, y, obj.x, obj.y))) {
                return true;
            } else {
                return false;
            }
        } else {
            const currentShoots = currentGame[0].filed2;
            if (currentShoots.some(obj => matchCoords(x, y, obj.x, obj.y))) {
                return true;
            } else {
                return false;
            }
        }
    }

}

function randomCoords() {
    const randomX = Math.floor(Math.random() * 10);
    const randomY = Math.floor(Math.random() * 10);
    return {x: randomX, y: randomY}
}

function matchCoords(randX: number, randY: number, x: number, y: number) {
    return randX === x && randY === y;
}

function nextTurn (gameInd: number) {
    const currentGame = games.filter(e => e.gameId === gameInd);
    if (currentGame[0].turn === 1) {
        currentGame[0].turn = 2;
    } else {
        currentGame[0].turn = 1;
    }
}

export function finishCheck(gameInd: number) {
    const currentGame = games.filter(e => e.gameId === gameInd);
    const ships1 = currentGame[0].ships1.every(ship => ship.hits >= ship.length);
    const ships2 = currentGame[0].ships2.every(ship => ship.hits >= ship.length);
    if (ships1) {
        const winId = currentGame[0].player2Ind;
        serverUsers.addWins(winId);
        return true
    } else if (ships2) {
        const winId = currentGame[0].player1Ind;
        serverUsers.addWins(winId);
        return true
    } else {
        return false
    }
}

export function getGameIdByPlayer(playerInd: number) {
    const game1 = games.filter(e => e.player1Ind === playerInd);
    if (game1.length > 0) {
        return {game: game1[0].gameId, player: game1[0].player2};
    }
    const game2 = games.filter(e => e.player2Ind === playerInd);
    if (game2.length > 0) {
        return {game:game2[0].gameId, player: game2[0].player1};
    }
    return undefined
}

function getKilledCellsX(gameInd: number, x: number, y: number, shipX: number, shipY: number, length: number, shootingPlayerId: number) {
    const cells = [];
    const finalCell = JSON.stringify({ "position": { x: x, y: y }, "currentPlayer": shootingPlayerId, "status": "killed" });
    cells.push(finalCell);

    for (let i = -1; i < length + 1; i++) {
        const c1 = JSON.stringify({ "position": { x: shipX + i, y: shipY + 1 }, "currentPlayer": shootingPlayerId, "status": "missed" });
        const c2 = JSON.stringify({ "position": { x: shipX + i, y: shipY - 1 }, "currentPlayer": shootingPlayerId, "status": "missed" });
        cells.push(c1);
        cells.push(c2);
    }
    cells.push(JSON.stringify({ "position": { x: shipX - 1, y: shipY }, "currentPlayer": shootingPlayerId, "status": "missed" }));
    cells.push(JSON.stringify({ "position": { x: shipX + length, y: shipY }, "currentPlayer": shootingPlayerId, "status": "missed" }));
    pushKilledCellsToGameData(gameInd, shootingPlayerId, cells);
    return cells
}

function getKilledCellsY(gameInd: number, x: number, y: number, shipX: number, shipY: number, length: number, shootingPlayerId: number) {
    const cells = [];
    const finalCell = JSON.stringify({ "position": { x: x, y: y }, "currentPlayer": shootingPlayerId, "status": "killed" });
    cells.push(finalCell);

    for (let i = -1; i < length + 1; i++) {
        const c1 = JSON.stringify({ "position": { x: shipX + 1, y: shipY + i }, "currentPlayer": shootingPlayerId, "status": "missed" });
        const c2 = JSON.stringify({ "position": { x: shipX - 1, y: shipY + i }, "currentPlayer": shootingPlayerId, "status": "missed" });
        cells.push(c1);
        cells.push(c2);
    }
    cells.push(JSON.stringify({ "position": { x: shipX, y: shipY + length }, "currentPlayer": shootingPlayerId, "status": "missed" }));
    cells.push(JSON.stringify({ "position": { x: shipX, y: shipY - 1 }, "currentPlayer": shootingPlayerId, "status": "missed" }));
    pushKilledCellsToGameData(gameInd, shootingPlayerId, cells);
    return cells
}

function pushKilledCellsToGameData(gameInd: number, shootingPlayerId: number, cells: string[]) {
    const currentGame = games.filter(e => e.gameId === gameInd);

    if (shootingPlayerId === 1) {
        cells.forEach((val) => {
            const data = JSON.parse(val);
            const coord = { x: data.position.x, y: data.position.y }
            currentGame[0].filed1.push(coord);
        });
    } else {
        cells.forEach((val) => {
            const data = JSON.parse(val);
            const coord = { x: data.position.x, y: data.position.y }
            currentGame[0].filed2.push(coord);
        });
    }
}

export const serverGames = new Games;