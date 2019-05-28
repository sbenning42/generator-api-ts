import { Request, Response } from "express";
import { ObjectID } from 'mongodb';
import { UserCreateLean, UserFindByIdAndAddRoles, UserFindByIdAndAddRolesLean } from "../apis/user/user";
import { RoleFindOneLean, RoleFindByIdAndAddUsersLeanExec, RoleFindOneLeanExec, RoleFindByIdAndAddUsersLean } from "../apis/role/role";

export async function createUserController(req: Request, res: Response) {
    const role = await RoleFindOneLean({ name: 'user' });
    try {
        const [{ _id: roleId }, user] = await Promise.all([
            RoleFindOneLean({ name: 'user' }),
            UserCreateLean(req.body),
        ]);
        const [roleAdd, userAdd] = await Promise.all([
            RoleFindByIdAndAddUsersLean(roleId, user._id),
            UserFindByIdAndAddRolesLean(user._id, roleId),
        ]);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: `Something went wrong`, error });
    }
}