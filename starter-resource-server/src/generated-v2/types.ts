
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';

export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

export type ID = string | number | ObjectID;

                            
export const Userv2Schema = new mongoose.Schema({
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
        ref: 'Todov2',
    }
}, { minimize: false, timestamps: true });

export const Userv2Model = mongoose.model('Userv2', Userv2Schema);
export type Userv2QueryObject = any
export interface Userv2ProjectionObject {
   username?: 0 | 1;
   password?: 0 | 1;
   roles?: 0 | 1;
   email?: 0 | 1;
   birthdate?: 0 | 1;
   json?: 0 | 1;
   todos?: 0 | 1;
}

export interface Userv2PopulateObject {
   todos?: boolean;
}

export interface Userv2 {
   id: ID;
   username: string;
   password?: string;
   roles: string[];
   email: string;
   birthdate: Date;
   json?: any;
   todos?: ObjectID[];
}

export interface Userv2Populated {
   id: ID;
   username: string;
   password?: string;
   roles: string[];
   email: string;
   birthdate: Date;
   json?: any;
   todos?: Todov2[];
}

export interface Userv2CreatePayloadModel {
   id: ID;
   username: string;
   password: string;
   email: string;
   birthdate: Date;
   json?: any;
}

export interface Userv2UpdatePayloadModel {
   id: ID;
   $set?: Userv2SetPayloadModel;
   $push?: Userv2PushPayloadModel;
   $pull?: Userv2PullPayloadModel;
}

export interface Userv2SetPayloadModel {
   username?: string;
   roles?: string[];
   email?: string;
   birthdate?: Date;
   json?: any;
}

export interface Userv2PushPayloadModel {
   roles?: string[];
}

export interface Userv2PullPayloadModel {
   roles?: string[];
}


export const Todov2Schema = new mongoose.Schema({
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
        default: ({ user }) => user.id,
        ref: 'Userv2',
    }
}, { minimize: false, timestamps: true });

export const Todov2Model = mongoose.model('Todov2', Todov2Schema);
export type Todov2QueryObject = any
export interface Todov2ProjectionObject {
   title?: 0 | 1;
   done?: 0 | 1;
   json?: 0 | 1;
   author?: 0 | 1;
}

export interface Todov2PopulateObject {
   author?: boolean;
}

export interface Todov2 {
   id: ID;
   title: string;
   done: boolean;
   json?: any;
   author: ObjectID;
}

export interface Todov2Populated {
   id: ID;
   title: string;
   done: boolean;
   json?: any;
   author: Userv2;
}

export interface Todov2CreatePayloadModel {
   id: ID;
   title: string;
   done: boolean;
   json?: any;
}

export interface Todov2UpdatePayloadModel {
   id: ID;
   $set?: Todov2SetPayloadModel;
   $push?: Todov2PushPayloadModel;
   $pull?: Todov2PullPayloadModel;
}

export interface Todov2SetPayloadModel {
   title?: string;
   done?: boolean;
   json?: any;
}

export interface Todov2PushPayloadModel {

}

export interface Todov2PullPayloadModel {

}
