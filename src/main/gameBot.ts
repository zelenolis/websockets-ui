import { Ship } from "../data/interfaces.js";

const shipsArray = [];

export function shipsPlacement() {
    shipsArray.splice(0, shipsArray.length);
    // number of all ships with their length
    const allShips = [3, 3, 2, 2, 2, 1, 1, 1, 1];

    // creating first 4-length large ship
    const firstRandom = randomCoords(4);
    const newLargeShip: Ship = {
        position: {
            x: firstRandom.x,
            y: firstRandom.y
        },
        direction: randomDirection(),
        length: 4,
        type: "huge"
    }

    shipsArray.push(newLargeShip)

    allShips.forEach((val) => {

        const newShip: Ship = {
            position: {
                x: 0,
                y: 0
            },
            direction: true,
            length: val,
            type: getSize(val)
        }
        
        do {
            const rnd = randomCoords(val);
            newShip.position.x = rnd.x;
            newShip.position.y = rnd.y;
            newShip.direction = randomDirection();
            
        } while (checkArray(newShip));

        shipsArray.push(newShip);
    });

    return shipsArray
}

function checkArray(ship1: Ship) {
    for (let i = 0; i < shipsArray.length; i++) {
        if (checkOverlap(ship1, shipsArray[i])) {
            return true
        }
    }
    return false
}

function checkOverlap(ship1: Ship, ship2: Ship) {
    const cells1 = getFirstShipCells(ship1);
    const cells2 = getShipCells(ship2);

    for (const cell1 of cells1) {
        for (const cell2 of cells2) {
            if (cell1.x === cell2.x && cell1.y === cell2.y) {
                return true;
            }
        }
    }

    return false;
}

// get occupied cells for checked ships with neighbor cells
function getFirstShipCells(ship: Ship) {
    const shipX = ship.position.x;
    const shipY = ship.position.y;
    const shipDir = ship.direction;
    const shipLen = ship.length;
    const cells =[];
    
    if (!shipDir) {
        for (let i = -1; i < shipLen + 1; i++) {
            cells.push({ x: shipX + i, y: shipY });
            cells.push({ x: shipX + i, y: shipY + 1 });
            cells.push({ x: shipX + i, y: shipY - 1 });
          }
    } else {
        for (let i = -1; i < shipLen + 1; i++) {
            cells.push({ x: shipX, y: shipY + i });
            cells.push({ x: shipX + 1, y: shipY + i });
            cells.push({ x: shipX - 1, y: shipY + i });
          }
    }

    return cells
}

// get occupied cells by other ships
function getShipCells(ship: Ship) {
    const shipX = ship.position.x;
    const shipY = ship.position.y;
    const shipDir = ship.direction;
    const shipLen = ship.length;
    const cells =[];
    
    if (!shipDir) {
        for (let i = 0; i < shipLen; i++) {
            cells.push({ x: shipX + i, y: shipY });
          }
    } else {
        for (let i = 0; i < shipLen; i++) {
            cells.push({ x: shipX, y: shipY + i });
          }
    }

    return cells
}

function randomDirection() {
    return Math.random() < 0.5;
}

function randomCoords(length: number) {
    const randomX = Math.floor(Math.random() * (11 - length));
    const randomY = Math.floor(Math.random() * (11 - length));
    return {x: randomX, y: randomY}
}

function getSize(val: number) {
    const sizeMapping = {
      1: "small",
      2: "medium",
      3: "large"
    };
  
    return sizeMapping[val];
  }