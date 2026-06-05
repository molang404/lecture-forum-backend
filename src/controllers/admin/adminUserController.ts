import { Request, Response } from "express";
import adminUserService from "../../services/admin/adminUserService.ts";

const getUserList = async (req: Request, res: Response) => {
    try {
        const users = await adminUserService.getUserList();
    } catch (error) {

    }
};

export default {
    getUserList,
};