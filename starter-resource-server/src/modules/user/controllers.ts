import { Request, Response } from "express";
import { mainUserService } from "./service";

export class UserControllers {
    async countUsers(req: Request, res: Response) {
        try {
            res.json(await mainUserService.countUsers());
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
}

export const mainUserControllers: UserControllers = new UserControllers();
