import { Router } from "express";
import noticeController from "../controllers/noticeController.ts";

const router = Router();

// 글 목록을 조회 : /notice/list
router.get("/list", noticeController.getNoticeList);
router.get("/:noticeId", noticeController.getNoticeById);

export default router;