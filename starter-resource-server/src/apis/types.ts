
import { Request, Response, NextFunction } from 'express';
import { Schema, model, Document, DocumentQuery } from 'mongoose';
import { ObjectID } from 'mongodb';
import { context } from '../config/context';


export const Mixed = Schema.Types.Mixed;
export const ObjectId = Schema.Types.ObjectId;

export type ID = string | ObjectID;



/********* USER *********/


export interface User {
   username: string;
   password: string;
   roles: string[];
   json?: any;
   todos?: Todo[];
    createdAt: string;
    updatedAt: string;
}


export interface UserCreateBody {
    id?: ID;
   username: string;
   password: string;
   json?: any;
}


export interface UserChangesBody {
   username?: string;
   password?: string;
   json?: any;
}


export interface UserPushBody {

}


export interface UserPullBody {

}


export interface UserUpdateBody {
    id: ID;
    changes?: UserChangesBody;
    push?: UserPushBody;
    pull?: UserPullBody;
}

export interface UserRawUpdateBody {
    changes?: UserChangesBody;
    push?: UserPushBody;
    pull?: UserPullBody;
}


export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        select: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
        select: false,
    },
    roles: {
        type: [String],
        required: true,
        unique: false,
        select: true,
        default: ['user'],
    },
    json: {
        type: Mixed,
        required: false,
        unique: false,
        select: true,
        default: {},
    },
    todos: [{
        type: ObjectId,
        ref: 'Todo',
        required: false,
        unique: false,
        select: true,
        default: [],
    }],
}, { minimize: false, timestamps: true }); 


export type UserDocument = Document & User;
export type UserDocumentsQuery = DocumentQuery<UserDocument[], UserDocument>;
export type UserDocumentQuery = DocumentQuery<UserDocument, UserDocument>;
export const UserModel = model<UserDocument>('User', UserSchema);
export type UserCondition = any;


export interface UserProjection {
    username: 0 | 1;
    password: 0 | 1;
    roles: 0 | 1;
    json: 0 | 1;
    todos: 0 | 1;
}


export type UserPopulate = 'todos';

        
/********* TODO *********/


export interface Todo {
   title: string;
   done: boolean;
   json?: any[];
   owner: User;
    createdAt: string;
    updatedAt: string;
}


export interface TodoCreateBody {
    id?: ID;
   title: string;
   done: boolean;
   json?: any[];
}


export interface TodoChangesBody {
   title?: string;
   done?: boolean;
   json?: any[];
}


export interface TodoPushBody {
   json?: any | any[];
}


export interface TodoPullBody {
   json?: any | any[];
}


export interface TodoUpdateBody {
    id: ID;
    changes?: TodoChangesBody;
    push?: TodoPushBody;
    pull?: TodoPullBody;
}

export interface TodoRawUpdateBody {
    changes?: TodoChangesBody;
    push?: TodoPushBody;
    pull?: TodoPullBody;
}


export const TodoSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        select: true,
    },
    done: {
        type: Boolean,
        required: true,
        unique: false,
        select: true,
        default: false,
    },
    json: {
        type: [Mixed],
        required: false,
        unique: false,
        select: true,
        default: {},
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
        unique: false,
        select: true,
        default: () => context().currentId,
    },
}, { minimize: false, timestamps: true }); 


export type TodoDocument = Document & Todo;
export type TodoDocumentsQuery = DocumentQuery<TodoDocument[], TodoDocument>;
export type TodoDocumentQuery = DocumentQuery<TodoDocument, TodoDocument>;
export const TodoModel = model<TodoDocument>('Todo', TodoSchema);
export type TodoCondition = any;


export interface TodoProjection {
    title: 0 | 1;
    done: 0 | 1;
    json: 0 | 1;
    owner: 0 | 1;
}


export type TodoPopulate = 'owner';

        