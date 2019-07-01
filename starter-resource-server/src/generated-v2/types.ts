
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import { gen } from '../lib/gen/core';

export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

export type ID = string | number | ObjectID;

                            
export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        select: true,
        default: undefined,
    },
    password: {
        type: String,
        required: true,
        unique: false,
        select: false,
        default: undefined,
    },
    roles: {
        type: [String],
        required: true,
        unique: false,
        select: true,
        default: ["user"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        select: true,
        default: undefined,
    },
    birthdate: {
        type: Date,
        required: true,
        unique: false,
        select: true,
        default: undefined,
    },
    json: {
        type: Mixed,
        required: false,
        unique: false,
        select: true,
        default: {},
    },
    todos: {
        type: [ObjectId],
        required: false,
        unique: false,
        select: true,
        default: [],
        ref: 'Todo',
    }
}, { minimize: false, timestamps: true });

export const UserModel = mongoose.model('User', UserSchema);
export type UserQueryObject = any
export interface UserProjectionObject {
   username?: 0 | 1;
   password?: 0 | 1;
   roles?: 0 | 1;
   email?: 0 | 1;
   birthdate?: 0 | 1;
   json?: 0 | 1;
   todos?: 0 | 1;
}

export interface UserPopulateObject {
   todos?: boolean;
}

export interface User {
   id: ID;
   username: string;
   password?: string;
   roles: string[];
   email: string;
   birthdate: Date;
   json?: any;
   todos?: ObjectID[];
}

export interface UserPopulated {
   id: ID;
   username: string;
   password?: string;
   roles: string[];
   email: string;
   birthdate: Date;
   json?: any;
   todos?: Todo[];
}

export interface UserCreatePayloadModel {
   id: ID;
   username: string;
   password: string;
   email: string;
   birthdate: Date;
   json?: any;
}

export interface UserUpdatePayloadModel {
   id: ID;
   $set?: UserSetPayloadModel;
   $push?: UserPushPayloadModel;
   $pull?: UserPullPayloadModel;
}

export interface UserSetPayloadModel {
   username?: string;
   roles?: string[];
   email?: string;
   birthdate?: Date;
   json?: any;
}

export interface UserPushPayloadModel {
   roles?: string[];
}

export interface UserPullPayloadModel {
   roles?: string[];
}


export const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        select: true,
        default: undefined,
    },
    done: {
        type: Boolean,
        required: true,
        unique: false,
        select: true,
        default: false,
    },
    json: {
        type: Mixed,
        required: false,
        unique: false,
        select: true,
        default: {},
    },
    author: {
        type: ObjectId,
        required: true,
        unique: false,
        select: true,
        default: () => gen.context.user.id,
        ref: 'User',
    }
}, { minimize: false, timestamps: true });

export const TodoModel = mongoose.model('Todo', TodoSchema);
export type TodoQueryObject = any
export interface TodoProjectionObject {
   title?: 0 | 1;
   done?: 0 | 1;
   json?: 0 | 1;
   author?: 0 | 1;
}

export interface TodoPopulateObject {
   author?: boolean;
}

export interface Todo {
   id: ID;
   title: string;
   done: boolean;
   json?: any;
   author: ObjectID;
}

export interface TodoPopulated {
   id: ID;
   title: string;
   done: boolean;
   json?: any;
   author: User;
}

export interface TodoCreatePayloadModel {
   id: ID;
   title: string;
   done: boolean;
   json?: any;
}

export interface TodoUpdatePayloadModel {
   id: ID;
   $set?: TodoSetPayloadModel;
   $push?: TodoPushPayloadModel;
   $pull?: TodoPullPayloadModel;
}

export interface TodoSetPayloadModel {
   title?: string;
   done?: boolean;
   json?: any;
}

export interface TodoPushPayloadModel {

}

export interface TodoPullPayloadModel {

}
