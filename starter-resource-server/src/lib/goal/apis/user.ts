import { ApiEntitySchema } from "../api-gen/core/types";
import { MINLENGTH, MAXLENGTH, NEVER, ADMIN, Pr } from "../api-gen/core/constantes";

export const user: ApiEntitySchema = {
    model: {
        username: {
            type: String,
            required: true,
            unique: true,
            validators: {
                all: [MINLENGTH(3), MAXLENGTH(255)],
            }
        },
        password: {
            type: String,
            required: true,
            guards: {
                select: NEVER,
                update: NEVER,
            },
            validators: {
                create: [MINLENGTH(8), MAXLENGTH(255)],
            }
        },
        roles: {
            type: [String],
            required: true,
            default: ['user'],
            guards: {
                create: NEVER,
                update: ADMIN
            },
            validators: {
                update: [(ctx: any, roles: string[]) => Pr(roles.every(role => ['user', 'admin'].includes(role)) ? null : { invalidValue: `Field 'roles' (${roles}) contains invalid value(s).` })]
            }
        }
    },
    ws: {
        all: {
            middlewares: [() => { console.log('In JWT') }],
        },
        mutation: {
            middlewares: [() => { console.log('In Self or Admin roles') }],
        },
        'POST /': {
            excludes: { 0: true, 1: true },
        },
        'DELETE /': {
            middlewares: [() => { console.log('In Admin role') }],
            excludes: { 1: true },
        },
        'PUT /:id/password': {
            middlewares: [() => { console.log('In custom ep controller') }]
        }
    }
};