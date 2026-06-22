import { Router } from "express";
import myDashboardController from "../controllers/myDashboardController.ts";
import { authenticate } from "../middlewares/auth.ts";

const router = Router();

router.get("/summary", authenticate, myDashboardController.getMyDashboardSummary);

export default router;