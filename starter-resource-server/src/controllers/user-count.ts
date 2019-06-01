import { Request, Response } from "express";
import { mainUserService } from "../apis/user/user";

export async function userCountController(req: Request, res: Response) {
    const { utils } = mainUserService;
    try {
        res.json(await utils.findAll().countDocuments());
    } catch (error) {
        res.status(400).json({ error, message: `Something went wrong.` })
    }
}
