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