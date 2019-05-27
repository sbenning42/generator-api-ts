import { generateAll } from "./api-generator/core";

import dotenv from "dotenv";
dotenv.config();

const { PATH_GENERATED, BACKUP_GENERATED } = process.env;

/**
 * Allowed types are:
 *  String Boolean Number Date Object
 * and their Array version. eg:
 * [String] [Boolean] [Number] [Date] [Object]
 *
 * Object are treated as Mixed
 * Embedded document are NOT handled
 */

generateAll(
  [
    {
      name: "Role",
      props: {
        name: {
          type: String,
          required: true,
          unique: true
        }
      },
      relations: {
        users: "[User]"
      }
    },
    {
      name: "User",
      props: {},
      relations: {
        roles: "[Role]",
        scopes: "[Scope]",
        credential: "Credential",
        profil: "Profil"
      },
      skips: ["getUserCredential"]
    },
    {
      name: "Scope",
      props: {
        name: {
          type: String,
          required: true,
          unique: true
        }
      },
      relations: {
        users: "[User]"
      }
    },
    {
      name: "Credential",
      props: {
        username: {
          type: String,
          required: true,
          unique: true
        },
        password: {
          type: String,
          required: true,
          hidden: true
        }
      },
      relations: {
        owner: "User"
      },
      skips: ["all"]
    },
    {
      name: "Profil",
      props: {
        username: {
          type: String,
          required: true,
          unique: true
        },
        email: {
          type: String,
          required: true,
          unique: true
        },
        name: {
          type: String,
          required: true
        },
        birthdate: {
          type: Date,
          required: true
        },
        json: {
          type: Object,
          default: {}
        }
      },
      relations: {
        owner: "User"
      }
    },
    {
      name: "Todo",
      props: {
        title: {
          type: String,
          required: true,
          unique: true
        },
        done: {
          type: Boolean,
          required: true
        }
      },
      relations: {
        owner: "User"
      }
    }
  ],
  PATH_GENERATED,
  BACKUP_GENERATED === "true"
);
