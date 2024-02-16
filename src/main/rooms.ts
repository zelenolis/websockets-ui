import { RoomsArray } from "../data/interfaces.js";
import { randomUUID } from "crypto";
import { serverUsers } from '../main/main.js';


const rooms: RoomsArray[] = [];

let ind = 0;

class Rooms {
    public createRoom(ip: string) {
        const userName = serverUsers.getUserNameByIp(ip);
        const userIndex = serverUsers.getUserIndexByIp(ip);
        const newRoom: RoomsArray = {
            "roomId": ++ind,
            "roomUsers": [{
                "name": userName,
                "index": userIndex
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