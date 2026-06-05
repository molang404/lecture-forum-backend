import { Router } from "express";
import adminUserController from "../../../controllers/admin/adminUserController.ts";
import { validate } from "../../../middlewares/validate.ts";
import { adminCreateUserSchema } from "../../../schemas/admin/user/adminCreateUser.ts";

const router = Router();

router.get("/list", validate(adminCreateUserSchema), adminUserController.getUserList);
router.post("/create")

export default router;