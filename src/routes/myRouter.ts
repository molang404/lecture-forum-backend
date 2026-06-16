import { Router } from "express";
import myDashboardController from "../controllers/myDashboardController.ts";

const router = Router();

router.get("/summary", myDashboardController.getMyDashboardSummary);

export default router;