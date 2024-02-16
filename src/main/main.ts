import { NewUser, UsersArray } from "../data/interfaces.js";


const users: UsersArray[] = [];

let ind = 0;

class Users {
    public newUser (data: NewUser, ip: string) {
        //check if user already exist
        users.forEach((user) => {
            //exists and correct
            if (user.name === data.name && user.password === data.password) {
                const returnedData = JSON.stringify({"name": user.name,"index": user.index, "error": false, "errorText": ""});
                const returned = JSON.stringify({
                    "type": "reg",
                    "data": returnedData,
                    "id": 0
                });
                console.log("exist")
                console.log(`name: ${user.name}, base pass: ${user.password}, inc pass: ${data.password}`)
                return returned
            }
            // exists with wrong password
            if (user.name === data.name && user.password !== data.password) {
                const returnedData = JSON.stringify({"name": user.name,"index": user.index, "error": true, "errorText": "incorrect password"});
                const returned = JSON.stringify({
                    "type": "reg",
                    "data": returnedData,
                    "id": 0
                });
                console.log("pass")
                console.log(`name: ${user.name}, base pass: ${user.password}, inc pass: ${data.password}`)
                return returned
            }
        });

        const createNewUser = {
            "name": data.name,
            "password": data.password,
            "ip": ip,
            "index": ++ind,
            "wins": 0
        }
        users.push(createNewUser);

        const returnedData = JSON.stringify({"name": createNewUser.name,"index": createNewUser.index, "error": false, "errorText": ""});
        const returned = JSON.stringify({
            "type": "reg",
            "data": returnedData,
            "id": 0
        });

        return returned
    }

    public getUserIndexByIp(ip: string) {
        let returned = 0;
        users.forEach((user) => {
            if (user.ip === ip) { returned = user.index }
        });
        return returned
    }

    public getUserNameByIp(ip: string) {
        let returned = '';
        users.forEach((user) => {
            if (user.ip === ip) { returned = user.name }
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