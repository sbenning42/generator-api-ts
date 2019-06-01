
import { Request, Response, NextFunction } from 'express';
import { Schema, model, Document, DocumentQuery } from 'mongoose';
import { ObjectID } from 'mongodb';
import { context } from '../config/context';


export const Mixed = Schema.Types.Mixed;
export const ObjectId = Schema.Types.ObjectId;

export type ID = string | ObjectID;



/********* USER *********/


export interface User {
    id: ID,
   username: string;
   password: string;
   roles: string[];
   json?: any;
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
}, { minimize: false, timestamps: true }); 


export type UserDocument = Document & User;
export type UserDocumentsQuery = DocumentQuery<UserDocument[], UserDocument>;
export type UserDocumentQuery = DocumentQuery<UserDocument, UserDocument>;
export const UserModel = model<UserDocument>('User', UserSchema);
export type UserCondition = any;


export interface UserProjection {
    createdAt: 0 | 1;
    updatedAt: 0 | 1;
    username: 0 | 1;
    password: 0 | 1;
    roles: 0 | 1;
    json: 0 | 1;
}


export type UserPopulate = '';

        