import { ObjectID } from "mongodb";

export type ID = string | number | ObjectID;

export interface User {
    id: ID;
    username: string;
    password?: string;
    store: ObjectID;
    json?: any;
    createdAt: Date;
    updatedAt?: Date;
}

export interface Store {
    id: ID;
    name: string;
    users: ObjectID[];
    products: ObjectID[];
    json?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Category {
    id: ID;
    name: string;
    products: ObjectID[];
    json?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Media {
    id: ID;
    name: string;
    products: ObjectID;
    json?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Product {
    id: ID;
    name: string;
    store: ObjectID;
    categories: ObjectID[];
    medias: ObjectID[];
    json?: any;
    createdAt?: Date;
    updatedAt?: Date;
}