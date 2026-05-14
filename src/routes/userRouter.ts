import express from "express";
import userController from "../controllers/userController.ts";

const router = express.Router();

router.post("/create", userController.createUser);

export default router;