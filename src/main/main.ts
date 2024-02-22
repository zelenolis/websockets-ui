import { NewUser, UsersArray } from "../data/interfaces.js";


const users: UsersArray[] = [];

class Users {
    public newUser (data: NewUser, ind: number) {

        const existUserId = users.map(user => user.name).indexOf(data.name);

        let returnedData: string = '';

        if (existUserId === -1) {
            const createNewUser = {
                "name": data.name,
                "password": data.password,
                "index": ind,
                "wins": 0
            }

            users.push(createNewUser);

            returnedData = JSON.stringify({
                "name": createNewUser.name,"index": createNewUser.index, "error": false, "errorText": ""
            });
        } else {
            if (users[existUserId].name === data.name && users[existUserId].password === data.password) {
                returnedData = JSON.stringify({
                    "name": users[existUserId].name,"index": ind, "error": false, "errorText": ""
                });
            }
            if (users[existUserId].name === data.name && users[existUserId].password !== data.password) {
                returnedData = JSON.stringify({
                    "name": users[existUserId].name,"index": ind, "error": true, "errorText": "incorrect password"
                });
            }
        }

        const returned = JSON.stringify({
            "type": "reg",
            "data": returnedData,
            "id": 0
        });

        return returned
    }

    public getUserNameById(id: number) {
        let returned = '';
        users.forEach((user) => {
            if (user.index === id) { returned = user.name }
        });
        return returned
    }
}

export function updWinners() {
    const winners = [];
    users.forEach((user) => {
        const winner = {
            "name": user.name,
            "wins": user.wins
        }
        winners.push(winner);
    })
    const returnedData = JSON.stringify(winners);
    const returned = JSON.stringify({
        "type": "update_winners",
        "data": returnedData,
        "id": 0
    });
    return returned;
}

export const serverUsers = new Users;