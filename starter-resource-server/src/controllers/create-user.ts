import { Request, Response } from "express";
import { UserCreateLean, UserFindByIdAndAddRolesLeanExec } from "../apis/user/user";
import { RoleFindByIdAndAddUsersLeanExec, RoleFindOneLeanExec } from "../apis/role/role";

export async function createUserController(req: Request, res: Response) {
    const role = await RoleFindOneLeanExec({ name: 'user' });
    try {
        const [{ _id: roleId }, user] = await Promise.all([
            RoleFindOneLeanExec({ name: 'user' }),
            UserCreateLean(req.body),
        ]);
        /*const [roleAdd, userAdd] = */await Promise.all([
            RoleFindByIdAndAddUsersLeanExec(roleId, user._id),
            UserFindByIdAndAddRolesLeanExec(user._id, roleId),
        ]);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: `Something went wrong`, error });
    }
}