import { Request, Response } from "express";

const createUser = (req: Request, res: Response) => {
    // 프론트앤드가 요청한 정보를 꺼냄

    const { username, password, name, nickname, email, phoneNumber, birthdate, gender, role } =
        req.body;

    // JSON -> 객체로 바꿀 때 가능한 건, string, boolean, number, null만 가능함
    // 날짜는 JSON.parse() 해도 string임

    const newUser = {
        username,
        password,
        name,
        nickname,
        phoneNumber,
        email,
        birthdate: birthdate ? new Date(birthdate) : null,
        gender,
        role
    }

    // newUser를 가지고 DB에 저장 -> service로 보내야 함
};

export default {
    createUser,
};
