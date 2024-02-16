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
    const regPass = parsed.name;

    return {
        "name": regName,
        "password": regPass
    }

}