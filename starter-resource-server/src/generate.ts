import { generateAll } from "./api-generator/core";

import dotenv from 'dotenv';
dotenv.config();

const {
    PATH_GENERATED,
    BACKUP_GENERATED
} = process.env;

generateAll(
    [
        {
            name: 'User',
            props: {},
            relations: {
                roles: '[Role]',
                scopes: '[Scope]',
                credential: 'Credential',
                profil: 'Profil',
            },
            query: {
                getUserCredential: {
                    skip: true,
                }
            },
            mutation: {
                addUserCredential: {
                    skip: true,
                },
                removeUserCredential: {
                    skip: true,
                }
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
            },
            query: {
                getAllCredential: {
                    skip: true,
                },
                getByIdCredential: {
                    skip: true,
                },
                getCredentialOwner: {
                    skip: true,
                },
            },
            mutation: {
                createCredential: {
                    skip: true,
                },
                updateCredential: {
                    skip: true,
                },
                deleteCredential: {
                    skip: true,
                },
                addCredentialOwner: {
                    skip: true,
                },
                removeCredentialOwner: {
                    skip: true,
                },
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
            },
        },
    ],
    PATH_GENERATED,
    BACKUP_GENERATED === 'true'
);
