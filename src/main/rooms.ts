import { RoomsArray } from "../data/interfaces.js";
import { serverUsers } from '../main/main.js';


const rooms: RoomsArray[] = [];

let ind = 0;

class Rooms {
    public createRoom(id: number) {
        const userName = serverUsers.getUserNameById(id);
        const newRoom: RoomsArray = {
            "roomId": ++ind,
            "roomUsers": [{
                "name": userName,
                "index": id
            }]
        };
        rooms.push(newRoom);
    }
}

export function updateRooms() {
    const returnedData = JSON.stringify(rooms);
    const returned = JSON.stringify({
        "type": "update_room",
        "data": returnedData,
        "id": 0
    });
    return returned;
}

export const serverRooms = new Rooms;