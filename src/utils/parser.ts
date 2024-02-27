import { PrimaryReq } from "../data/interfaces.js";

export const primaryParse = (inc: string) => {
    const primaryParsed: PrimaryReq = JSON.parse(inc);
    const type = primaryParsed.type;
    const data = primaryParsed.data;

    return {type: type, data: data}
}

export const regParse = (data: string) => {
    const parsed = JSON.parse(data);

    const regName = parsed.name;
    const regPass = parsed.password;

    return {
        name: regName,
        password: regPass
    }
}

export const addToRoomParse = (data: string) => {
    const parsed = JSON.parse(data);
    return parsed.indexRoom;
}

export const simpleDataParse = (data: string) => {
    const parsed = JSON.parse(data);
    return parsed;
}