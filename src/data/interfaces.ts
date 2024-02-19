export interface UsersArray {
    "name": string,
    "password": number,
    "index": number,
    "wins": number
}

export interface RoomsArray {
    "roomId": number,
    "roomUsers": Roomusers[]
}

interface Roomusers {
    "name": string,
    "index": number
}

export interface GamesArray {
    turn: number,
    gameId: number,
    player1: number,
    player1Ind: number,
    player2: number,
    player2Ind: number,
    ships1: Ship[],
    ships2: Ship[]
}

export interface Ship {
    position: {
        "x": number,
        "y": number,
    },
    "direction": boolean,
    "length": number,
    "type": "small"|"medium"|"large"|"huge",
    "hits"?: number
}

export interface PrimaryReq {
    type: string,
    data: string,
    id: number
}

export interface Registration {
    "type": string,
    "data":
        {
            "name": string,
            "password": number
        },
    "id": number,
}

export interface NewUser {
    "name": string,
    "password": number
}

export interface RegistrationComplete {
    "type": string,
    "data":
        {
            "name": string,
            "index": number,
            "error": boolean,
            "errorText": string
        },
    "id": number,
}

export interface UpdateWinners {
    "type": string,
    "data":
        [
            {
                "name": string,
                "wins": number,
            }
        ],
    "id": number,
}