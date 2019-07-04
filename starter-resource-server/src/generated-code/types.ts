
import { ObjectID } from 'mongodb';
import { ID } from '../common/api-gen';



export interface User {
    id: ObjectID;
    username: string;
    password: string;
    roles: string[];
    todos: ObjectID[];
}


export interface PopulatedUser {
    id: ID;
    username: string;
    password: string;
    roles: string[];
    todos: Todo[];
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


export interface Todo {
    id: ObjectID;
    title: string;
    done: boolean;
    author: ObjectID;
}


export interface PopulatedTodo {
    id: ID;
    title: string;
    done: boolean;
    author: User;
}


export interface CreateTodo {
    title: string;
    done: boolean;
}


export interface SetTodo {
    title?: string;
    done?: boolean;
}


export interface PushTodo {

}


export interface PullTodo {

}


export interface UpdateTodo {
    id: ID;
    set?: SetTodo;
    push?: PushTodo;
    pull?: PullTodo;
}
