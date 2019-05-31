
import { Request, Response, NextFunction } from 'express';
import { Schema, model, Document, DocumentQuery } from 'mongoose';
import { ObjectID } from 'mongodb';


export const Mixed = Schema.Types.Mixed;
export const ObjectId = Schema.Types.ObjectId;

export type ID = string | ObjectID;



/********* USER *********/


export interface User {
   username: string;
   password: string;
}


export interface UserCreateBody {
    id?: ID;
   username: string;
   password: string;
}


export interface UserChangesBody {
   username?: string;
   password?: string;
}


export interface UserUpdateBody {
    id: ID;
    changes: UserChangesBody;
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
}, { minimize: false }); 


export type UserDocument = Document & User;
export type UserDocumentsQuery = DocumentQuery<UserDocument[], UserDocument>;
export type UserDocumentQuery = DocumentQuery<UserDocument, UserDocument>;
export const UserModel = model<UserDocument>('User', UserSchema);
export type UserCondition = any;


export interface UserProjection {
    username: 0 | 1;
    password: 0 | 1;
}


export type UserPopulate = '';

        