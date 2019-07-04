import mongoose from 'mongoose';
import { user } from '../../../apis/user';
import { getMongooseEquivalentType } from './get-mongoose-equivalent-type';
import { NEVER } from './constantes';
import { ApiEntityModelFieldSchema } from './types';

export let UserSchema: any;
export let UserModel: any;

export function prepareUser() {
    UserSchema = new mongoose.Schema(Object.entries(user.model).reduce((thisAll, [fieldName, field]: [string, ApiEntityModelFieldSchema]) => {
        thisAll[fieldName] = {
            type: getMongooseEquivalentType(field.type),
            required: field.required || false,
            unique: field.unique || false,
            select: ! (field.guards && field.guards.select === NEVER),
            default: field.default,
        };
        if ((Array.isArray(field.type) && typeof(field.type[0]) === 'string') || typeof(field.type) === 'string') {
            thisAll[fieldName].ref = Array.isArray(field.type) ? field.type[0] : field.type;
        }
        return thisAll;
    }, {}));

    UserModel = mongoose.model('User', UserSchema);

}