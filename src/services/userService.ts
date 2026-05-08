import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";

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
                throw error;      // return과 같은데 값을 리턴하는게 아니라 에러를 리턴하는 키워드
            }

            }
        }
};

// 1. Prisma 에러 발생! 얜 5가지 종류 에러 존재
// 2. catch 실행, 우리가 지정한 Error가 아니면 그 에러 객체 그대로 상위 함수에 throw
// 3. Controller의 catch에 잡힘
// 4. 자바스크립트 표준 Error가 아니므로, if 통과

export default {
    createUser,
};
