import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import myDashboardService from "../services/myDashboardService.ts";

const getMyDashboardSummary = async (req: AuthRequest, res: Response) => {
    try {
        const postPage = Number(req.query.postPage) || 1;
        const replyPage = Number(req.query.replyPage) || 1;
        const size = Number(req.query.size) || 5;

        if (!req.user) {
            res.status(401).send({
                message: "로그인이 필요한 서비스입니다.",
            });
            return;
        }
        const userId = req.user.id;

        const result = await myDashboardService.getMyDashboardSummary(userId, postPage, replyPage, size);
        res.status(200).json({
            message: "회원님의 대시보드 데이터를 성공적으로 불러왔습니다.",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "회원님의 대시보드 데이터를 불러오는 중 오류가 발생했습니다.",
        });
    }
};

export default {
    getMyDashboardSummary,
};
