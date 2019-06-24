import { augmentSchema } from './augment-schema';
import { MySchema, MyContext } from './types';
import { ONLY_READ, CANNOT } from './constantes';

const hasRoles = (...refs: string[]) => (roles: string[] = []) => refs.some(ref => roles.includes(ref));
const isAdmin = hasRoles('admin');
const self = hasRoles('self');
const adminOrSelf = hasRoles('admin', 'self');

const minLength = (length: number, message: string = `Should be at least ${length} caracters long.`) => (input: string) => input.length < length
    ? { message }
    : null;

export function test() {
    const schema: MySchema = {
        config: {
        },
        entities: {

            /** USER */
            user: {
                /** Model */
                fields: {
                    username: {
                        type: String,
                        attributes: {
                            required: true,
                            unique: true,
                        }
                    },
                    password: {
                        type: String,
                        attributes: {
                            required: true,
                            select: false,
                        },
                        validators: [minLength(8)]
                    },
                    email: {
                        type: String,
                        attributes: {
                            required: true,
                            unique: true,
                        },
                        validators: [minLength(3)]
                    },
                    roles: {
                        type: [String],
                        default: ['user'],
                        attributes: {
                            required: true,
                            can: {
                                create: CANNOT, // not grabbed from req.body on creation. MUST have a `default` id it is `required`
                                update: ({ user }: MyContext) => user && isAdmin(user.roles), // grabbed from req.body on update, only if `auth` user has `admin` role
                            },
                        }
                    },
                    firstName: {
                        type: String,
                        attributes: {
                            required: true,
                        }
                    },
                    lastName: {
                        type: String,
                        attributes: {
                            required: true,
                        }
                    },
                    birthdate: Date, // short hand definition. Apply all default
                    json: Object, // short hand definition. Apply all default
                    todos: {
                        type: '[Todo]',
                        attributes: {
                            /**
                             * short hand for { read: CAN, create: CANNOT, update: CANNOT }
                             * as `todos` is a relation, `update` has a special meaning here:
                             * - should this field be grabbed from req.body on update
                             * - should this entity expose generated add/delete relation(s) Web Services
                             * As well for `read`, it define the ability to expose the field onto res.json(...)
                             * as well as defining if the entity should expose a generated Web Service to read this relation
                             * 
                             * So, with the `ONLY_READ` strategy applied, the field will never be exposed for edition.
                             * Rather, it's counterpart (the related field from the related entity (aka: the one pointed by `type`)),
                             * may activate it's `autoReverse` flag.
                             * If so, when the related entity instance will be created/deleted or will has it's relation field updated,
                             * the corresponding operation will apply to this field (aka: `todos`)
                             */
                            can: ONLY_READ
                        }
                    },
                    fullName: {
                        /**
                         * When `type` is a function, the field will NOT be include
                         * in the geberated `mongoose.Schema` and will not be persisted by anyway.
                         * Rather, on read operation, the field is dynamicaly populated by calling
                         * it's `type` function with the model document as parameter
                         */
                        type: ({ firstName, lastName }: any) => `${firstName} ${lastName}`,
                    },
                },
                /** Web Services */
                services: {
                    all: {
                        can: ({ user }: MyContext) => user && adminOrSelf(user.roles),
                    },
                    /**
                     * The more the `service` is specific, the more precedance it takes
                     * in the final `can` value for the field.
                     * aka: `all` is the less specific `service` selector,
                     * `all` < `query`|`mutation` < `readAll`|`readOne`|`create`|`update`|`delete` < (:?GET|POST|UPDATE|DELETE|get|post|update|delete) \/[\w|\/]* 
                     */
                    delete: {
                        can: ({ user }: MyContext) => user && isAdmin(user.roles),
                    }
                }
            },

            todo: {
                fields: {
                    title: {
                        type: String,
                        attributes: {
                            required: true,
                            unique: true
                        }
                    },
                    tags: {
                        type: '[Tag]',
                        autoReverse: true,
                    },
                    owner: {
                        type: 'User',
                        default: ({ user }: MyContext) => user && user.id,
                        attributes: {
                            required: true,
                            can: ONLY_READ
                        },
                        autoReverse: true,
                    },
                }
            },

            tag: {
                fields: {
                    name: {
                        type: String,
                        attributes: {
                            required: true,
                            unique: true,
                        }
                    },
                    todos: {
                        type: '[Todo]',
                        autoReverse: true,
                    },
                }
            }
        }
    };

    augmentSchema(schema);
}