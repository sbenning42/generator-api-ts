
import {
    Request,
    Response,
    NextFunction,
    Router,
    Application
} from 'express';
import mongoose, { Document, Query } from 'mongoose';
import { ObjectID } from 'mongodb';
        
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;



/**********     USER     **********/


//  
// Base entity interface
//

export interface User {
    _id: string;
    username: string;
    password: string;
    roles?: [Role];
}
            
//  
// Input payload interface for entity creation
//

export interface UserCreateInput {
    _id?: string,
    username: string;
    password: string;
}

//
// Function used to pick only needed properties
//

export function pickUserCreateInput<T extends { _id?: string|ObjectID }>(input: T) {
    if (input._id !== undefined
        && input._id !== null
    ) {
        input._id = typeof(input._id) === 'string' ? new ObjectID(input._id) : input._id;
    }
    return ['username','password'].reduce((createInput, key) => {
        createInput[key] = input[key];
        return createInput;
    }, {}) as UserCreateInput;
}
            
//  
// Input payload interface for entity update
//

export interface UserChangesInput {
    username?: string;
    password?: string;
}

//
// Function used to pick only needed properties
//

export function pickUserChangesInput<T extends {}>(input: T) {
    return ['username','password'].reduce((changesInput, key) => {
        changesInput[key] = input[key];
        return changesInput;
    }, {}) as UserChangesInput;
}

export interface UserUpdateInput {
    id: string;
    changes: UserChangesInput;
}
            
//  
// Mongoose Schema/Model for this entity
//

export const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: [{
            type: ObjectId,
            ref: 'Role',
        }],
    },
    {
        minimize: false,
    }
);
export const UserModel = mongoose.model<Document & User>('User', UserSchema);

/**********     ROLE     **********/


//  
// Base entity interface
//

export interface Role {
    _id: string;
    name: string;
    users?: [User];
}
            
//  
// Input payload interface for entity creation
//

export interface RoleCreateInput {
    _id?: string,
    name: string;
}

//
// Function used to pick only needed properties
//

export function pickRoleCreateInput<T extends { _id?: string|ObjectID }>(input: T) {
    if (input._id !== undefined
        && input._id !== null
    ) {
        input._id = typeof(input._id) === 'string' ? new ObjectID(input._id) : input._id;
    }
    return ['name'].reduce((createInput, key) => {
        createInput[key] = input[key];
        return createInput;
    }, {}) as RoleCreateInput;
}
            
//  
// Input payload interface for entity update
//

export interface RoleChangesInput {
    name?: string;
}

//
// Function used to pick only needed properties
//

export function pickRoleChangesInput<T extends {}>(input: T) {
    return ['name'].reduce((changesInput, key) => {
        changesInput[key] = input[key];
        return changesInput;
    }, {}) as RoleChangesInput;
}

export interface RoleUpdateInput {
    id: string;
    changes: RoleChangesInput;
}
            
//  
// Mongoose Schema/Model for this entity
//

export const RoleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        users: [{
            type: ObjectId,
            ref: 'User',
        }],
    },
    {
        minimize: false,
    }
);
export const RoleModel = mongoose.model<Document & Role>('Role', RoleSchema);