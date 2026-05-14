import { Router } from "express";
import userController from "../controllers/userController.ts";
import { validate } from "../middlewares/validate.ts";
import { createUserSchema } from "../schemas/user/createUser.ts";
import {loginSchema} from "../schemas/user/login.ts";

const router = Router();

router.post("/create", validate(createUserSchema), userController.createUser);
router.post("/login", validate(loginSchema), userController.login);

// 똑같은 경로라도 여러개의 라우터 가능(경로, 방식 둘다 보기 때문)

export default router;
