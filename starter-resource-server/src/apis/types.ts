
import {
    Request,
    Response,
    NextFunction,
    Router,
    Application
} from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
        
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;



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
    name: string;
}

//
// Function used to pick only needed properties
//

export function pickRoleCreateInput<T extends {}>(input: T) {
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
        users: {
            type: [ObjectId],
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const RoleModel = mongoose.model('Role', RoleSchema);

/**********     USER     **********/
//  
// Base entity interface
//

export interface User {
    _id: string;
    roles?: [Role];
    scopes?: [Scope];
    credential?: Credential;
    profil?: Profil;
}
            
//  
// Input payload interface for entity creation
//

export interface UserCreateInput {

}

//
// Function used to pick only needed properties
//

export function pickUserCreateInput<T extends {}>(input: T) {
    return [].reduce((createInput, key) => {
        createInput[key] = input[key];
        return createInput;
    }, {}) as UserCreateInput;
}
            
//  
// Input payload interface for entity update
//

export interface UserChangesInput {

}

//
// Function used to pick only needed properties
//

export function pickUserChangesInput<T extends {}>(input: T) {
    return [].reduce((changesInput, key) => {
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
        roles: {
            type: [ObjectId],
            ref: 'Role',
        },
        scopes: {
            type: [ObjectId],
            ref: 'Scope',
        },
        credential: {
            type: ObjectId,
            ref: 'Credential',
        },
        profil: {
            type: ObjectId,
            ref: 'Profil',
        },
    },
    {
        minimize: false,
    }
);
export const UserModel = mongoose.model('User', UserSchema);

/**********     SCOPE     **********/
//  
// Base entity interface
//

export interface Scope {
    _id: string;
    name: string;
    users?: [User];
}
            
//  
// Input payload interface for entity creation
//

export interface ScopeCreateInput {
    name: string;
}

//
// Function used to pick only needed properties
//

export function pickScopeCreateInput<T extends {}>(input: T) {
    return ['name'].reduce((createInput, key) => {
        createInput[key] = input[key];
        return createInput;
    }, {}) as ScopeCreateInput;
}
            
//  
// Input payload interface for entity update
//

export interface ScopeChangesInput {
    name?: string;
}

//
// Function used to pick only needed properties
//

export function pickScopeChangesInput<T extends {}>(input: T) {
    return ['name'].reduce((changesInput, key) => {
        changesInput[key] = input[key];
        return changesInput;
    }, {}) as ScopeChangesInput;
}

export interface ScopeUpdateInput {
    id: string;
    changes: ScopeChangesInput;
}
            
//  
// Mongoose Schema/Model for this entity
//

export const ScopeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        users: {
            type: [ObjectId],
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const ScopeModel = mongoose.model('Scope', ScopeSchema);

/**********     CREDENTIAL     **********/
//  
// Base entity interface
//

export interface Credential {
    _id: string;
    username: string;
    password: string;
    owner?: User;
}
            
//  
// Input payload interface for entity creation
//

export interface CredentialCreateInput {
    username: string;
    password: string;
}

//
// Function used to pick only needed properties
//

export function pickCredentialCreateInput<T extends {}>(input: T) {
    return ['username','password'].reduce((createInput, key) => {
        createInput[key] = input[key];
        return createInput;
    }, {}) as CredentialCreateInput;
}
            
//  
// Input payload interface for entity update
//

export interface CredentialChangesInput {
    username?: string;
    password?: string;
}

//
// Function used to pick only needed properties
//

export function pickCredentialChangesInput<T extends {}>(input: T) {
    return ['username'].reduce((changesInput, key) => {
        changesInput[key] = input[key];
        return changesInput;
    }, {}) as CredentialChangesInput;
}

export interface CredentialUpdateInput {
    id: string;
    changes: CredentialChangesInput;
}
            
//  
// Mongoose Schema/Model for this entity
//

export const CredentialSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            hidden: true,
        },
        owner: {
            type: ObjectId,
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const CredentialModel = mongoose.model('Credential', CredentialSchema);

/**********     PROFIL     **********/
//  
// Base entity interface
//

export interface Profil {
    _id: string;
    username: string;
    email: string;
    name: string;
    birthdate: Date;
    json?: any;
    owner?: User;
}
            
//  
// Input payload interface for entity creation
//

export interface ProfilCreateInput {
    username: string;
    email: string;
    name: string;
    birthdate: Date;
    json?: any;
}

//
// Function used to pick only needed properties
//

export function pickProfilCreateInput<T extends {}>(input: T) {
    return ['username','email','name','birthdate','json'].reduce((createInput, key) => {
        createInput[key] = input[key];
        return createInput;
    }, {}) as ProfilCreateInput;
}
            
//  
// Input payload interface for entity update
//

export interface ProfilChangesInput {
    username?: string;
    email?: string;
    name?: string;
    birthdate?: Date;
    json?: any;
}

//
// Function used to pick only needed properties
//

export function pickProfilChangesInput<T extends {}>(input: T) {
    return ['username','email','name','birthdate','json'].reduce((changesInput, key) => {
        changesInput[key] = input[key];
        return changesInput;
    }, {}) as ProfilChangesInput;
}

export interface ProfilUpdateInput {
    id: string;
    changes: ProfilChangesInput;
}
            
//  
// Mongoose Schema/Model for this entity
//

export const ProfilSchema = new mongoose.Schema(
    {
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
            type: Mixed,
            default: {},
        },
        owner: {
            type: ObjectId,
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const ProfilModel = mongoose.model('Profil', ProfilSchema);

/**********     TODO     **********/
//  
// Base entity interface
//

export interface Todo {
    _id: string;
    title: string;
    done: boolean;
    owner?: User;
}
            
//  
// Input payload interface for entity creation
//

export interface TodoCreateInput {
    title: string;
    done: boolean;
}

//
// Function used to pick only needed properties
//

export function pickTodoCreateInput<T extends {}>(input: T) {
    return ['title','done'].reduce((createInput, key) => {
        createInput[key] = input[key];
        return createInput;
    }, {}) as TodoCreateInput;
}
            
//  
// Input payload interface for entity update
//

export interface TodoChangesInput {
    title?: string;
    done?: boolean;
}

//
// Function used to pick only needed properties
//

export function pickTodoChangesInput<T extends {}>(input: T) {
    return ['title','done'].reduce((changesInput, key) => {
        changesInput[key] = input[key];
        return changesInput;
    }, {}) as TodoChangesInput;
}

export interface TodoUpdateInput {
    id: string;
    changes: TodoChangesInput;
}
            
//  
// Mongoose Schema/Model for this entity
//

export const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        done: {
            type: Boolean,
            required: true,
        },
        owner: {
            type: ObjectId,
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const TodoModel = mongoose.model('Todo', TodoSchema);
export function contextMiddleware(req: Request, res: Response, next: NextFunction) {
    req['CTX'] = req['CTX'] ? req['CTX'] : {};
    req['CTX'].req = req;
    req['CTX'].res = res;
    next();
};

export function attachCTX(req: Request, key: string, value: any) {
    req['CTX'][key] = value;
    return value;
}

export const ResetCCC = "[0m";
export const BrightCCC = "[1m";
export const DimCCC = "[2m";
export const UnderscoreCCC = "[4m";
export const BlinkCCC = "[5m";
export const ReverseCCC = "[7m";
export const HiddenCCC = "[8m";
export const FgBlackCCC = "[30m";
export const FgRedCCC = "[31m";
export const FgGreenCCC = "[32m";
export const FgYellowCCC = "[33m";
export const FgBlueCCC = "[34m";
export const FgMagentaCCC = "[35m";
export const FgCyanCCC = "[36m";
export const FgWhiteCCC = "[37m";
export const BgBlackCCC = "[40m";
export const BgRedCCC = "[41m";
export const BgGreenCCC = "[42m";
export const BgYellowCCC = "[43m";
export const BgBlueCCC = "[44m";
export const BgMagentaCCC = "[45m";
export const BgCyanCCC = "[46m";
export const BgWhiteCCC = "[47m";

export function colorVerb(verb: string) {
    switch (verb) {
        case 'GET':
            return `${BrightCCC}${FgBlueCCC}GET${ResetCCC}`;
        case 'POST':
            return `${BrightCCC}${FgGreenCCC}POST${ResetCCC}`;
        case 'PUT':
            return `${BrightCCC}${FgYellowCCC}PUT${ResetCCC}`;
        case 'DELETE':
            return `${BrightCCC}${FgRedCCC}DELETE${ResetCCC}`;
        default:
            return verb;
    }
}
export function colorPath(path: string) {
    const parts = path.split('/').slice(1);
    parts[0] = `${UnderscoreCCC}${BrightCCC}${parts[0]}${ResetCCC}${UnderscoreCCC}`;
    if (parts[1]) {
        parts[1] = `${UnderscoreCCC}${FgBlueCCC}${parts[1]}${ResetCCC}${UnderscoreCCC}`;
    }
    if (parts[2]) {
        parts[2] = `${UnderscoreCCC}${BrightCCC}${FgYellowCCC}${parts[2]}${ResetCCC}${UnderscoreCCC}`;
    }
    if (parts[3] && parts[3] === 'add') {
        parts[3] = `${UnderscoreCCC}${FgGreenCCC}${parts[3]}${ResetCCC}${UnderscoreCCC}`;
    } else if (parts[3] && parts[3] === 'remove') {
        parts[3] = `${UnderscoreCCC}${FgRedCCC}${parts[3]}${ResetCCC}${UnderscoreCCC}`;
    }
    return `${UnderscoreCCC}${parts.join('/')}${ResetCCC}`;
}