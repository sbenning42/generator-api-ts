
import { Request, Response, NextFunction } from 'express';
import { Schema, model, Document, DocumentQuery } from 'mongoose';
import { ObjectID } from 'mongodb';
import { context } from '../config/context';


export const Mixed = Schema.Types.Mixed;
export const ObjectId = Schema.Types.ObjectId;

export type ID = string | ObjectID;



/********* USER *********/


export interface User {
    id?: ID,
    _id?: ID,
   username: string;
   password: string;
   roles: string[];
   store: Store;
   json?: any;
    createdAt: string;
    updatedAt: string;
}


export interface UserCreateBody {
    id?: ID,
    _id?: ID,
   username: string;
   password: string;
   store: Store;
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
    store: {
        type: ObjectId,
        ref: 'Store',
        required: true,
        unique: false,
        select: true,
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
    store: 0 | 1;
    json: 0 | 1;
}


export type UserPopulate = 'store';

        
/********* STORE *********/


export interface Store {
    id?: ID,
    _id?: ID,
   name: string;
   videos?: Video[];
    createdAt: string;
    updatedAt: string;
}


export interface StoreCreateBody {
    id?: ID,
    _id?: ID,
   name: string;
}


export interface StoreChangesBody {
   name?: string;
}


export interface StorePushBody {

}


export interface StorePullBody {

}


export interface StoreUpdateBody {
    id: ID;
    changes?: StoreChangesBody;
    push?: StorePushBody;
    pull?: StorePullBody;
}

export interface StoreRawUpdateBody {
    changes?: StoreChangesBody;
    push?: StorePushBody;
    pull?: StorePullBody;
}


export const StoreSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        select: true,
    },
    videos: [{
        type: ObjectId,
        ref: 'Video',
        required: false,
        unique: false,
        select: true,
        default: [],
    }],
}, { minimize: false, timestamps: true }); 


export type StoreDocument = Document & Store;
export type StoreDocumentsQuery = DocumentQuery<StoreDocument[], StoreDocument>;
export type StoreDocumentQuery = DocumentQuery<StoreDocument, StoreDocument>;
export const StoreModel = model<StoreDocument>('Store', StoreSchema);
export type StoreCondition = any;


export interface StoreProjection {
    createdAt: 0 | 1;
    updatedAt: 0 | 1;
    name: 0 | 1;
    videos: 0 | 1;
}


export type StorePopulate = 'videos';

        
/********* VIDEO *********/


export interface Video {
    id?: ID,
    _id?: ID,
   name: string;
   json?: any;
   store: Store;
    createdAt: string;
    updatedAt: string;
}


export interface VideoCreateBody {
    id?: ID,
    _id?: ID,
   name: string;
   json?: any;
}


export interface VideoChangesBody {
   json?: any;
}


export interface VideoPushBody {

}


export interface VideoPullBody {

}


export interface VideoUpdateBody {
    id: ID;
    changes?: VideoChangesBody;
    push?: VideoPushBody;
    pull?: VideoPullBody;
}

export interface VideoRawUpdateBody {
    changes?: VideoChangesBody;
    push?: VideoPushBody;
    pull?: VideoPullBody;
}


export const VideoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        select: true,
    },
    json: {
        type: Mixed,
        required: false,
        unique: false,
        select: true,
    },
    store: {
        type: ObjectId,
        ref: 'Store',
        required: true,
        unique: false,
        select: true,
        default: () => context().req.user.store,
    },
}, { minimize: false, timestamps: true }); 


export type VideoDocument = Document & Video;
export type VideoDocumentsQuery = DocumentQuery<VideoDocument[], VideoDocument>;
export type VideoDocumentQuery = DocumentQuery<VideoDocument, VideoDocument>;
export const VideoModel = model<VideoDocument>('Video', VideoSchema);
export type VideoCondition = any;


export interface VideoProjection {
    createdAt: 0 | 1;
    updatedAt: 0 | 1;
    name: 0 | 1;
    json: 0 | 1;
    store: 0 | 1;
}


export type VideoPopulate = 'store';

        