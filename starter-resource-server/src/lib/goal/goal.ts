import { getCtx } from './ctx';

export const Pr = (thing: any) => Promise.resolve(thing);

// Validators
export const REQUIRED = (ctx: any, input: string) => Pr(![null, undefined].includes(input) ? null : { required: 'Input is required.' });
export const MINLENGTH = (length: number) => (ctx: any, input: string) => Pr(input && input.length > length ? null : { minLength: 'Input too short.' });
export const MAXLENGTH = (length: number) => (ctx: any, input: string) => Pr(input && input.length < length ? null : { minLength: 'Input too long.' });
export const MIN = (min: number) => (ctx: any, input: number) => Pr(input && input > min ? null : { minLength: 'Input too little.' });
export const MAX = (max: number) => (ctx: any, input: number) => Pr(input && input < max ? null : { minLength: 'Input too big.' });

// Guards
export const NEVER = [() => Pr({ unauthorized: 'unauthorized' })];
export const ALWAYS = [() => Pr(null)];
export const ADMIN = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'admin' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];
export const SELF = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'self' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];
export const OWNER = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'owner' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];

export const user = {
    model: {
        username: {
            type: String,
            required: true,
            unique: true,
            validators: {
                both: [MINLENGTH(5)]
            }
        },
        password: {
            type: String,
            required: true,
            select: false,
            guards: {
                select: NEVER,
                update: NEVER
            },
            validators: {
                both: [MINLENGTH(8), MAXLENGTH(255)]
            }
        },
        roles: {
            type: [String],
            required: true,
            default: ['user'],
            guards: {
                create: NEVER,
                update: ADMIN
            }
        },
        todos: {
            type: ['Todo'],
            default: [],
        }
    },
    ws: {

    }
};

export const todo = {
    model: {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        author: {
            type: 'User',
            required: true,
            default: () => {
                const ctx = getCtx();
                return ctx.user && ctx.user.id;
            },
            guards: {
                select: ADMIN,
                create: NEVER,
                update: NEVER,
            },
            reverse: true,
        }
    },
    ws: {

    }
};

export const augmentSchema = (schema: any) => {
    Object.entries(schema)
        .forEach(([apiName, api]: [string, any]) => {
            Object.entries(api.model)
                .forEach(([fieldName, field]: [string, any]) => {
                    if (field.guards && field.guards.all) {
                        field.guards.select = field.guards.select ? field.guards.all.concat(...field.guards.select) : [...field.guards.all];
                        field.guards.create = field.guards.create ? field.guards.all.concat(...field.guards.create) : [...field.guards.all];
                        field.guards.update = field.guards.update ? field.guards.all.concat(...field.guards.update) : [...field.guards.all];
                    }
                    if (field.validators && field.validators.all) {
                        field.validators.create = field.validators.create ? field.validators.all.concat(...field.validators.create) : [...field.validators.all];
                        field.validators.update = field.validators.update ? field.validators.all.concat(...field.validators.update) : [...field.validators.all];
                    }
                });
        });
};


getCtx().schema = augmentSchema({ user, todo });

export class UserUtils {
    runSelectGuards() {
        const ctx = getCtx();
        const { user: { model } } = ctx.schema;
    }
    runCreateGuards() {}
    runUpdateGuards() {}
}
