import fs from 'fs';
import { APIGenerator, CRUDSchemaInput } from "./core";

import dotenv from 'dotenv';
dotenv.config();

const { BACKUP_GENERATED } = process.env;

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
        },
        query: {
            
        },
        mutation: {
            addUserCredential: {
                skip: true
            }
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
            json: {
                type: Object,
                default: {}
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

const content = G.suf() + schemas.reduce((all, schema) => {
    const thisContent = G.generate(schema);
    return all ? `${all}\n${thisContent}` : thisContent;
}, '');

if (BACKUP_GENERATED === 'true') {
    try {
        const old = fs.readFileSync(`./src/apis/apis.ts`, 'utf8');
        if (old) {
            fs.writeFileSync(`./src/apis/apis.ts.${Date.now()}.bk`, old, { encoding: 'utf8', flag: 'w' });
        }
    }catch(e){
        console.log('Something Went wrong.', e);
    }
}

try {
    fs.writeFileSync(`./src/apis/apis.ts`, content, { encoding: 'utf8', flag: 'w' });
}catch(e){
    console.log('Something Went wrong.', e);
}
