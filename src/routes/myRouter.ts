import { Router } from "express";
import myController from "../controllers/myController.ts";
import { authenticate } from "../middlewares/auth.ts";

const router = Router();

router.get("/post", authenticate, myController.getMyPost);
router.get("/reply", authenticate, myController.getMyReply);

export default router;