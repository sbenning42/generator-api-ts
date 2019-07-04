
import { ObjectID } from 'mongodb';
import { ID } from '../common/api-gen';



export interface User {
    id: ObjectID;
    username: string;
    password: string;
    roles: string[];
}


export interface PopulatedUser {
    id: ID;
    username: string;
    password: string;
    roles: string[];
}


export interface CreateUser {
    username: string;
    password: string;
}


export interface SetUser {
    username?: string;
    roles?: string[];
}


export interface PushUser {
    roles?: string[];
}


export interface PullUser {
    roles?: string[];
}


export interface UpdateUser {
    id: ID;
    set?: SetUser;
    push?: PushUser;
    pull?: PullUser;
}
