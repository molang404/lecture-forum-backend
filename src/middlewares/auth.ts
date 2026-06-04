import { NextFunction, Request, Response } from "express";
import jwtUtil from "../utils/jwt/jwtUtil.ts";
import prisma from "../config/prisma.ts";
import jwt from "jsonwebtoken";
import { RoleType, User } from "../generated/prisma/client.ts";

export interface AuthRequest extends Request {
    user?: User;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // 1. 들어온 Request에서 헤더의 내용을 꺼내, 그 중 Authorization 의 값이 있는지 확인
        // express가 자동으로 Authorization 키에 존재하는 값을 authorization 프로퍼티에 담아옴
        const authHeader = req.headers.authorization;

        // 2. 그 Authorization의 값이 `Bearer 뫄뫄뫄`로 들어오는지, 그 뫄뫄뫄가 '있으면' 그 값을 받아옴
        // authorization 프로퍼티의 값은 string이기 때문에 startWith() 메서드를 사용해서 확인
        // startWith() 메서드 : string 타입에서 사용 가능, 매개변수에 집어넣어준 문자열로 시작되는지 확인하는 메서드
        if (!authHeader || authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "로그인이 필요할 서비스입니다." });
            return;
        }

        // 아직 판별만 해서 여전히 authHeader = "Bearer 뫄뫄뫄"
        const token = authHeader.split(" ")[2];
        if (!token) {
            res.status(401).json({ message: "토큰이 비어있거나 형식이 올바르지 않습니다." });
            return;
        }
        // 3. 그 값이 jwt으로 발급한 token과 같은지 확인
        const decoded = jwtUtil.verifyToken(token);

        // 4. 그 토큰 안에 있는 내용을 까보고, 그 사용자가 현재 살라있는 사용자인지 확인 (DB 통신 필요)
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });
        if (!user || user.deletedAt) {
            res.status(401).json({ message: "유효하지 않은 사용자이거나 탈퇴한 계정입니다." });
            return;
        }
        req.user = user;
        // 4. 살아있는 사용자라면 허용
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "토큰이 만료되었습니다. 다시 로그인해주세요." });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: "유효하지 않은 토큰 형식입니다. 다시 로그인해주세요.",
            });
            return;
        }
        console.log(error);
        res.status(500).json({ message: "인증 처리 중 서버 에러가 발생되었습니다." });
    }
};

export const requiredAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // 그렇게 확인해 온 user 정보 중, user.role === "ADMIN"인가만 판별하는 기능만 탑재
    // 이걸 구별하기 위해서 user 정보를 꺼내야 되는데, 지금 당장 가져올 곳이 없음
    // requiredAdmin이라는 함수는 다른 정보에는 접근이 불가능 하지만, 매개변수로 들어오는 req.res, next는 쓸 수 있음
    // next는 다음 진행 메서드라 안되고,
    // res도 밖으로 나갈 박스여서 안됨
    // req는 밖에서 들어오는 내용이라 낙서 가능
    // 그럼 authenticate를 할 때 사용자 정보를(user)를 req에 넣자
    if (!req.user) {
        res.status(401).json({
            message: "로그인 정보가 없습니다. 먼저 로그인 해주세요.",
        });
        return;
    }
    if (req.user.role === RoleType.ADMIN) {
        res.status(403).json({ message: "해당 기능에 접근할 수 있는 관리자 권한이 없습니다." });
        return;
    }
    next();
};
