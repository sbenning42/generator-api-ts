import { ApiEntityModelFieldTypeUnion } from "./types";
import { ObjectID } from "mongodb";

export function getInterfaceEquivalentType(_type: ApiEntityModelFieldTypeUnion) {
    const array = Array.isArray(_type);
    const type = array ? _type[0] : _type;
    switch (true) {
        case type === Boolean:
            return array ? `boolean[]` : 'boolean';
        case type === String:
            return array ? `string[]` : 'string';
        case type === Number:
            return array ? `number[]` : 'number';
        case type === Date:
            return array ? `Date[]` : 'Date';
        case type === Object:
            return array ? `any[]` : 'any';
        case type === ObjectID:
            return array ? `ObjectID[]` : 'ObjectID';
        case typeof(type) === 'string':
            return array ? `${type}[]` : `${type}`;
        default:
            throw new Error(`Do not know type ${_type}.`);
    }
}