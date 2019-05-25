import fs from 'fs';
import { APIGenerator, CRUDSchemaInput } from "./core";

const G = new APIGenerator;

const schemas: CRUDSchemaInput<any, any>[] = [
    {
        name: 'User',
        props: {},
        relations: {
            roles: '[Role]',
            scopes: '[Scope]',
            credential: 'Credential',
            profil: 'Profil',
        }
    },
    {
        name: 'Role',
        props: {
            name: {
                type: String,
                required: true,
                unique: true,
            }
        },
        relations: {
            users: '[User]'
        }
    },
    {
        name: 'Scope',
        props: {
            name: {
                type: String,
                required: true,
                unique: true,
            }
        },
        relations: {
            users: '[User]'
        }
    },
    {
        name: 'Credential',
        props: {
            username: {
                type: String,
                required: true,
                unique: true,
            },
            password: {
                type: String,
                required: true,
            },
        },
        relations: {
            owner: 'User'
        }
    },
    {
        name: 'Profil',
        props: {
            username: {
                type: String,
                required: true,
                unique: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
            },
            name: {
                type: String,
                required: true,
            },
            birthdate: {
                type: Date,
                required: true,
            },
        },
        relations: {
            owner: 'User'
        }
    },
    {
        name: 'Todo',
        props: {
            title: {
                type: String,
                required: true,
                unique: true,
            },
            done: {
                type: Boolean,
                required: true,
            },
        },
        relations: {
            owner: 'User'
        }
    },
];

schemas.forEach(schema => fs.writeFileSync(`./src/apis/${schema.name.toLowerCase()}-api.ts`, `${G.suf()}${G.generate(schema)}`, 'utf8'));
