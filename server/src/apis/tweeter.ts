import { ctx } from "../common/api-gen";
import { MINLENGTH, Pr, NEVER, MAXLENGTH } from "../common/api-gen/core/constantes";
import { mainPassportService } from "../modules/passport/service";

export const user = {
    model: {
        username: {
            type: String,
            required: true,
            unique: true,
            validators: {
                all: [MINLENGTH(5)]
            }
        },
        password: {
            type: String,
            required: true,
            validators: {
                all: [MINLENGTH(8)]
            }
        },
        roles: {
            type: [String],
            required: true,
            default: ['user'],
            guards: {
                create: NEVER,
                update: [
                    (ctx: any) => Pr(ctx.user.roles.includes('admin') ? null : { unauthorized: 'unauthorized' }),
                ]
            },
            validators: {
                update: [
                    (roles: string[]) => Pr(roles.every(role => ['user', 'admin'].includes(role)) ? null : { unknow: `Unknow role in ${roles}` }),
                ]
            }
        },
        tags: {
            type: ['Tag'],
            default: [],
            guards: {
                create: NEVER,
                update: NEVER,
            },
            reverse: 'creator',
        },
        tweets: {
            type: ['Tweet'],
            default: [],
            guards: {
                create: NEVER,
                update: NEVER,
            },
            reverse: 'author',
        },
        comments: {
            type: ['Comment'],
            default: [],
            guards: {
                create: NEVER,
                update: NEVER,
            },
            reverse: 'author',
        }
    },
    ws: {
        all: {
            middlewares: [
                mainPassportService.jwt(),
            ]
        },
        mutation: {
            middlewares: [
                mainPassportService.hasRole(['self', 'admin']),
            ]
        },
        'POST /': {
            excludes: {
                0: true,
                1: true,
            }
        },
        'DELETE /:id': {
            middlewares: [
                mainPassportService.hasRole(['admin']),
            ],
            excludes: {
                1: true
            }
        }
    }
};
export const tweet = {
    model: {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
            validators: {
                all: [MAXLENGTH(140)]
            }
        },
        tags: {
            type: ['Tag'],
            default: [],
            reverse: 'tweets',
        },
        comments: {
            type: ['Comment'],
            default: [],
            guards: {
                create: NEVER,
                update: NEVER,
            },
            reverse: 'tweets'
        },
        author: {
            type: 'User',
            required: true,
            default: () => ctx().req.user.id,
            guards: {
                create: NEVER,
                update: NEVER,
            },
            reverse: 'tweets'
        }
    },
    ws: {
        all: {
            middlewares: [
                mainPassportService.jwt(),
            ]
        },
        mutation: {
            middlewares: [
                mainPassportService.hasRole(['owner', 'admin']),
            ]
        },
        'DELETE /:id': {
            middlewares: [
                mainPassportService.hasRole(['admin']),
            ],
            excludes: {
                1: true
            }
        }
    }
};
export const tag = {
    model: {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        creator: {
            type: 'User',
            required: true,
            default: () => ctx().req.user.id,
            guards: {
                create: NEVER,
                update: NEVER,
            },
            reverse: 'tags'
        },
        tweets: {
            type: ['Tweet'],
            default: [],
            guards: {
                create: NEVER,
                update: NEVER,
            },
        }
    },
    ws: {
        all: {
            middlewares: [
                mainPassportService.jwt(),
            ]
        },
        mutation: {
            middlewares: [
                mainPassportService.hasRole(['owner', 'admin']),
            ]
        },
        'DELETE /:id': {
            middlewares: [
                mainPassportService.hasRole(['admin']),
            ],
            excludes: {
                1: true
            }
        }
    }
};
export const comment = {
    model: {
        content: {
            type: String,
            required: true,
        },
        tweet: {
            type: 'Tweet',
            required: true,
            guards: {
                update: NEVER,
            },
            reverse: 'comments'
        },
        author: {
            type: 'User',
            required: true,
            default: () => ctx().req.user.id,
            guards: {
                create: NEVER,
                update: NEVER,
            },
            reverse: 'comments'
        }
    },
    ws: {
        all: {
            middlewares: [
                mainPassportService.jwt(),
            ]
        },
        mutation: {
            middlewares: [
                mainPassportService.hasRole(['owner', 'admin']),
            ]
        },
        'DELETE /:id': {
            middlewares: [
                mainPassportService.hasRole(['admin']),
            ],
            excludes: {
                1: true
            }
        }
    }
};