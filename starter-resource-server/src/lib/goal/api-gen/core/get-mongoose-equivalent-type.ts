import { ApiEntityModelFieldTypeUnion } from "./types";
import { Mixed, ObjectId } from "./constantes";

export function getMongooseEquivalentType(_type: ApiEntityModelFieldTypeUnion) {
    const array = Array.isArray(_type);
    const type = array ? _type[0] : _type;
    switch (true) {
        case type === Boolean:
        case type === String:
        case type === Number:
        case type === Date:
            return array ? [type] : type;
        case type === Object:
            return array ? [Mixed] : Mixed;
        case typeof(type) === 'string':
            return array ? [ObjectId] : ObjectId;
        default:
            throw new Error(`Do not know type ${_type}.`);
    }
}