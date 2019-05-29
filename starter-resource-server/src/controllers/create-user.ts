import { Request, Response } from "express";
import { UserCreateLean, UserFindByIdAndAddRolesLeanExec, UserCreate } from "../apis/user/user";
import { RoleFindByIdAndAddUsersLeanExec, RoleFindOneLeanExec, RoleFindOne } from "../apis/role/role";

export async function createUserController(req: Request, res: Response) {
    try {
        const [{ _id: roleId }, user] = await Promise.all([
            RoleFindOneLeanExec({ name: 'user' }),
            UserCreateLean(req.body),
        ]);
        await Promise.all([
            RoleFindByIdAndAddUsersLeanExec(roleId, user._id),
            UserFindByIdAndAddRolesLeanExec(user._id, roleId),
        ]);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: `Something went wrong`, error });
    }
}

export async function createUserImprovedController(req: Request, res: Response) {
    try {
        const [roleQuery, userQuery] = await Promise.all([
            RoleFindOne({ name: 'user' }),
            UserCreate(req.body),
        ]);
        roleQuery.update({ $push: { users: userQuery._id } });
        userQuery.update({ $push: { roles: roleQuery._id } });
        const [, user] = await Promise.all([roleQuery.save(), userQuery.save()]);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: `Something went wrong`, error });
    }
}