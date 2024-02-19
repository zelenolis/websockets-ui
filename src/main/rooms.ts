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

    public addToRoom(userId: number, ind: number) {
        //check if room exist
        const currentRoom = rooms.filter(e => e.roomId === ind);
        if (!currentRoom) {
            return
        }
        const roomUsers = currentRoom[0].roomUsers;
        console.log(`currentRoom: ${JSON.stringify(currentRoom[0])}, roomuser: ${JSON.stringify(roomUsers[0])}`);
        //check if user is not the same
        if (roomUsers[0].index === userId) {
            return
        }
        const roomCreatorId = roomUsers[0].index;
        const roomReadyIndex = rooms.findIndex((e) => {
            e.roomId === ind
        });
        //remove fulfilled room
        rooms.splice(roomReadyIndex, 1);
        return [userId, roomCreatorId];
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