import { ApiEntitySchema } from "../common/api-gen/core/types";
import { ctx } from "../common/api-gen";
import { NEVER } from "../common/api-gen/core/constantes";
import { mainPassportService } from "../modules/passport/service";
import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';

export const todo: ApiEntitySchema = {
    config: {
        ownerFieldName: 'author',
    },
    model: {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        done: {
            type: Boolean,
            required: true,
            default: false,
        },
        author: {
            type: 'User',
            required: true,
            default: () => ctx().user._id,
            guards: {
                create: NEVER,
                update: NEVER,
            },
            reverse: 'todos',
        }
    },
    ws: {
        all: {
            
            secure: true,
            middlewares: [
                mainPassportService.jwt(),
                
                async (req: Request, res: Response, next: NextFunction) => {
                    const id = req.params.id;
                    if (id === undefined) {
                        ctx().user.roles.push('owner');
                    } else {
                        const model = mongoose.model('Todo');
                        const todo = await model.findById(id);
                        if (todo.get('author').toString() === ctx().user._id) {
                            ctx().user.roles.push('owner');
                        }
                    }
                    next();
                }
                
            ]
            
        },
        mutation: {
            middlewares: [/*mainPassportService.hasRole(['admin', 'owner'])*/]
        }
    }
};