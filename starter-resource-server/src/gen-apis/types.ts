
import { Request, Response, NextFunction } from 'express';
import { Schema, model, Document, DocumentQuery } from 'mongoose';
import { ObjectID } from 'mongodb';


export const Mixed = Schema.Types.Mixed;
export const ObjectId = Schema.Types.ObjectId;

export type ID = string | ObjectID;



/********* CREDENTIAL *********/


export interface Credential {
   user: string;
   password: string;
   owner: User;
}


export interface CredentialCreateBody {
    id?: ID;
   user: string;
   password: string;
   owner: User;
}


export interface CredentialChangesBody {
   user?: string;
   password?: string;
}


export interface CredentialUpdateBody {
    id: ID;
    changes: CredentialChangesBody;
}


export const CredentialSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true,
        hidden: false,
    },
    password: {
        type: String,
        required: true,
        unique: false,
        hidden: false,
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        hidden: false,
    },
}, { minimize: false }); 


export type CredentialDocument = Document & Credential;
export type CredentialDocumentsQuery = DocumentQuery<CredentialDocument[], CredentialDocument>;
export type CredentialDocumentQuery = DocumentQuery<CredentialDocument, CredentialDocument>;
export const CredentialModel = model<CredentialDocument>('Credential', CredentialSchema);
export type CredentialCondition = any;


export interface CredentialProjection {
    user: 0 | 1;
    password: 0 | 1;
    owner: 0 | 1;
}


export type CredentialPopulate = 'owner';

        
/********* USER *********/


export interface User {
   email: string;
   username: string;
   birthDate: Date;
   json?: any;
   roles: string[];
   credential: Credential;
}


export interface UserCreateBody {
    id?: ID;
   email: string;
   username: string;
   birthDate: Date;
   json?: any;
}


export interface UserChangesBody {
   email?: string;
   username?: string;
   birthDate?: Date;
   json?: any;
}


export interface UserUpdateBody {
    id: ID;
    changes: UserChangesBody;
}


export const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        hidden: false,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        hidden: false,
    },
    birthDate: {
        type: Date,
        required: true,
        unique: false,
        hidden: false,
    },
    json: {
        type: Mixed,
        required: false,
        unique: false,
        hidden: false,
        default: {},
    },
    roles: [{
        type: String,
        required: true,
        unique: false,
        hidden: false,
        default: ['user'],
    }],
    credential: {
        type: ObjectId,
        ref: 'Credential',
        required: true,
        unique: true,
        hidden: true,
    },
}, { minimize: false }); 


export type UserDocument = Document & User;
export type UserDocumentsQuery = DocumentQuery<UserDocument[], UserDocument>;
export type UserDocumentQuery = DocumentQuery<UserDocument, UserDocument>;
export const UserModel = model<UserDocument>('User', UserSchema);
export type UserCondition = any;


export interface UserProjection {
    email: 0 | 1;
    username: 0 | 1;
    birthDate: 0 | 1;
    json: 0 | 1;
    roles: 0 | 1;
    credential: 0 | 1;
}


export type UserPopulate = 'credential';

        