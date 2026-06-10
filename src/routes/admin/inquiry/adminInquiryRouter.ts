import {Router} from "express";
import adminInquiryController from "../../../controllers/admin/adminInquiryController.ts";
import { validate } from "../../../middlewares/validate.ts";
import { inquiryAnswerSchema } from "../../../schemas/inquiry/inquiryAnswerSchema.ts";

const router = Router();

router.get("/list", adminInquiryController.getInquiryList);
router.get("/:inquiryId", adminInquiryController.getInquiryById);
// 답변 등록: post여도 되고, patch로 해도 됨         -> post (같은 주소)
// 주소를 /admin/inquiry/글번호/create 할 경우      -> patch
// 처음 설계할 때에는 "수정 기능"을 만들려고 했는데, 만들고 보니 이 API를 생성과 수정이 같이 이용하게 돼서
// post 방식 -> patch 변경
router.patch("/:inquiryId", validate(inquiryAnswerSchema), adminInquiryController.answerInquiry);

// 답변 삭제: patch여도 되고, delete도 됨           -> delete (같은 주소)
// 주소를 /admin/inquiry/글번호/delete 할 경우      -> patch
router.delete("/:inquiryId", adminInquiryController.deleteInquiry);

export default router;

// 답변 수정: patch                                -> patch (같은 주소)
// 주소를 /admin/inquiry/글번호/update 할 경우      -> patch