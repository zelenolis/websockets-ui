import { GamesArray, Ship } from "../data/interfaces.js";

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
            ships2: []
        }
        games.push(newGame);
        return newGame.gameId;
    }

    public addShips (gameIndex: number, ships: Ship[], gamePlayerIndex: number) {
        const currentGame = games.filter(e => e.gameId === gameIndex);
        
        if (gamePlayerIndex === 1) {
            currentGame[0].ships1.push(ships[0]);
        } else {
            currentGame[0].ships2.push(ships[0]);
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
            currentShips = currentGame[0].ships1;
        } else {
            currentShips = currentGame[0].ships2;
        }

        console.log(`x: ${xCoord}, y: ${yCoord}`);
        console.log(`current ships[0]: ${JSON.stringify(currentShips[0])}`);

        for (let ship of currentShips) {
            const shipX = ship.position.x;
            const shipY = ship.position.y;
            const direction = ship.direction;
            const shipLength = ship.length
            let hits = ship.hits ?? 0;
            if (direction) {
                if (shipX <= xCoord && xCoord < shipX + shipLength && shipY === yCoord) {
                    hits +=1;
                    if (hits >= ship.length) {
                        ship.hits = hits;
                        shipStatus = "killed";
                    } else {
                        ship.hits = hits;
                        shipStatus = "shot";
                    }                    
                }
            } else {
                if (shipY <= yCoord && yCoord < shipY + shipLength && shipX === xCoord) {
                    hits +=1;
                    if (hits >= ship.length) {
                        ship.hits = hits;
                        shipStatus = "killed";
                    } else {
                        ship.hits = hits;
                        shipStatus = "shot";
                    }    
                }
            }
            shipStatus = "miss";

            nextTurn(gameInd);

            return JSON.stringify({ "position": { x: xCoord, y: yCoord, }, "currentPlayer": shootingPlayerId, "status": shipStatus });

        }
        
    }
}

function nextTurn (gameInd: number) {
    const currentGame = games.filter(e => e.gameId === gameInd);
    if (currentGame[0].turn === 1) {
        currentGame[0].turn = 2;
    } else {
        currentGame[0].turn = 1;
    }
}

export const serverGames = new Games;