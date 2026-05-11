import { UserCreateInput } from "../../generated/prisma/models/User.ts";
import prisma from "../../config/prisma.ts";
import { Prisma } from "../../generated/prisma/client.ts";
import passwordUtil from "../../utils/password/passwordUtil.ts";
import jwtUtil from "../../utils/jwt/jwtUtil.ts";
import {LoginInputType} from "../../schemas/user/login.ts";

const createUser = async (data: UserCreateInput) => {
    try {
        return await prisma.user.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Prisma error 객체 내부에 code 항목 값이 "P2002"인 것이
            // 중복값이 있을 때의 에러 코드임
            if (error.code === "P2002") {
                // 중복된 칼럼이 어떤 것인지에 대한 정보는
                // error.meta?.target에 들어있는데 이 프로퍼티 타입은 string[] | undefined
                const errorMessage = error.message;

                // 예시. target = {"username", "nickname"}
                // array의 요소 중 "이 값"이 있는지 확인하는 메서드는 .includes()
                // .find()와 비슷한 역할이지만,
                // find는 조건을 걸어서 찾을 수 있는 메서드이고 (리턴값은 찾은 그 요소)
                // includes는 단순히 집어넣은 값과 완벽히 일치하는 것이 있는지 true/false로 찾음
                if (errorMessage.includes("username")) {
                    // 상위함수로 새로운 자바스크립트의 표준 객체를 만들어서 던짐
                    // 그 내용은 "ALREADY_EXISTS_USERNAME"이라고 담음
                    throw new Error("ALREADY_EXISTS_USERNAME");
                }
                if (errorMessage.includes("email")) {
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
                if (errorMessage.includes("nickname")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                throw error; // return과 같은데 값을 리턴하는게 아니라 에러를 리턴하는 키워드
            }
        }
    }
};

// 1. Prisma 에러 발생! 얜 5가지 종류 에러 존재
// 2. catch 실행, 우리가 지정한 Error가 아니면 그 에러 객체 그대로 상위 함수에 throw
// 3. Controller의 catch에 잡힘
// 4. 자바스크립트 표준 Error가 아니므로, if 통과

const login = async (data: LoginInputType) => {
    // prisma.테이블.findUnique(조건객체) : SELECT 명령 (단, Unique 칼럼을 통해)
    // findUnique라는 메서드는 객체 1개만 리턴
    // find라는 메서드는 Array가 리턴
    const user = await prisma.user.findUnique({
        where: {
            username: data.username,
        },
    });

    // 검색을 했는데 해당하는 내용이 없는건, 에러가 아님.
    // DB에서 조회한 내용인 user가 없거나 deletedAt의 값이 있으면
    if (!user || user.deletedAt) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await passwordUtil.verifyPassword(data.password, user.password);
    if (!isValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // 아이디와 비밀번호가 일치하는 정보가 있다는 뜻
    const token = jwtUtil.generateToken(user.id);

    // password와 deleteAt이라는 항목은 response(응답)에 포함시킬 필요 없어서, 그걸 제외한 나머지만 safeUserInfo에 저장
    const { password, deletedAt, ...safeUserInfo } = user;

    return {
        user: safeUserInfo,
        token,
    };

    // createUser에서는
    // 에러가 나는 부분에 에러 객체가 Prisma Error 객체였기 때문에
    // service에서 JavascriptError 객체로 바꿔줄 필요가 있었지만,
    // login에서는
    // 에러를 Javascript Error 객체로 만들었기 때문에 그대로 controller로 보내도 됨
};

export default {
    createUser,
    login,
};
