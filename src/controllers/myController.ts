import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import myService from "../services/myService.ts";

const getMyPost = async (req: AuthRequest, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 5;

        if (!req.user) {
            res.status(401).send({
                message: "로그인이 필요한 서비스입니다.",
            });
            return;
        }
        const userId = req.user.id;

        const result = await myService.getMyPost(userId, page, size);
        res.status(200).json({
            message: "회원님의 게시글 목록을 성공적으로 불러왔습니다.",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: "목록 조회 중 서버 에러가 발생했습니다.",
        });
    }
};

const getMyReply = async (req: AuthRequest, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 5;

        if (!req.user) {
            res.status(401).send({
                message: "인증되지 않은 사용자입니다.",
            });
            return;
        }

        const userId = req.user.id;

        const result = myService.getMyReply(userId, page, size);
        res.status(200).json({
            message: "회원님의 댓글 목록을 성공적으로 불러왔습니다.",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: "서버 에러가 발생되었습니다.",
        });
    }
};

export default {
    getMyPost,
    getMyReply,
};
