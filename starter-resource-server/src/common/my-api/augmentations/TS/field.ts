import { _MyField } from "../../types";
import { format } from "../../format";
import { fieldTypeTSTPL, fieldCreateTSTPL, fieldUpdateTSTPL, fieldIterableTSTPL, fieldPopulatedTypeTSTPL, fieldCanReadTSTPL, fieldCanCreateTSTPL, fieldCanUpdateTSTPL } from "../../templates/TS/field";
import { capitalize } from "../../common";

export function stringifyFieldTypeForTSType(field: _MyField) {
    const {
        type,
    } = field;
    switch (true) {
        case type === Boolean:
            return 'boolean';
        case type === String:
            return 'string';
        case type === Number:
            return 'number';
        case type === Date:
            return 'Date';
        case type === Object:
            return 'any';
        case typeof(type) === 'string':
            return 'ID';
        case typeof(type) === 'function':
            return field.returnType;
        default:
            throw new Error(`stringifyFieldTypeForTSType: Do not know type (${field.type})`);
    }
}

export function stringifyFieldTypeForTSPopulatedType(field: _MyField) {
    const {
        type,
    } = field;
    switch (true) {
        case type === Boolean:
            return 'boolean';
        case type === String:
            return 'string';
        case type === Number:
            return 'number';
        case type === Date:
            return 'Date';
        case type === Object:
            return 'any';
        case typeof(type) === 'string':
            return type as string;
        case typeof(type) === 'function':
            return field.returnType;
        default:
            throw new Error(`stringifyFieldTypeForTSType: Do not know type (${field.type})`);
    }
}

export function stringifyFieldTypeForTSCreate(field: _MyField) {
    const {
        type,
    } = field;
    switch (true) {
        case type === Boolean:
            return 'boolean';
        case type === String:
            return 'string';
        case type === Number:
            return 'number';
        case type === Date:
            return 'Date';
        case type === Object:
            return 'any';
        case typeof(type) === 'string':
            return 'ID';
        default:
            throw new Error(`stringifyFieldTypeForTSCreate: Do not know type (${field.type})`);
    }
}

export function stringifyFieldTypeForTSUpdate(field: _MyField) {
    const {
        type,
    } = field;
    switch (true) {
        case type === Boolean:
            return 'boolean';
        case type === String:
            return 'string';
        case type === Number:
            return 'number';
        case type === Date:
            return 'Date';
        case type === Object:
            return 'any';
        case typeof(type) === 'string':
            return 'ID';
        default:
            throw new Error(`stringifyFieldTypeForTSUpdate: Do not know type (${field.type})`);
    }
}

export function stringifyFieldTypeForTSIterable(field: _MyField) {
    const {
        type,
    } = field;
    switch (true) {
        case type === Boolean:
            return 'boolean';
        case type === String:
            return 'string';
        case type === Number:
            return 'number';
        case type === Date:
            return 'Date';
        case type === Object:
            return 'any';
        case typeof(type) === 'string':
            return 'ID';
        default:
            throw new Error(`stringifyFieldTypeForTSIterable: Do not know type (${field.type})`);
    }
}

/** TYPE */
export function augmentFieldType(field: _MyField) {
    return format(fieldTypeTSTPL({
        name: field.name,
        type: stringifyFieldTypeForTSType(field),
        required: field.attributes.required,
        array: field.attributes.isArray,
    }));
}

/** POPULATED TYPE */
export function augmentFieldPopulatedType(field: _MyField) {
    return format(fieldPopulatedTypeTSTPL({
        name: field.name,
        type: stringifyFieldTypeForTSPopulatedType(field),
        required: field.attributes.required,
        array: field.attributes.isArray,
    }));
}

/** CREATE */
export function augmentFieldCreate(field: _MyField) {
    return format(fieldCreateTSTPL({
        name: field.name,
        type: stringifyFieldTypeForTSCreate(field),
        required: field.attributes.required,
        array: field.attributes.isArray,
    }));
}

/** UPDATE */
export function augmentFieldUpdate(field: _MyField) {
    return format(fieldUpdateTSTPL({
        name: field.name,
        type: stringifyFieldTypeForTSUpdate(field),
        array: field.attributes.isArray,
    }));
}

/** ITERABLE */
export function augmentFieldIterable(field: _MyField) {
    return format(fieldIterableTSTPL({
        name: field.name,
        type: stringifyFieldTypeForTSIterable(field),
    }));
}

/** CAN READ */
export function augmentFieldCanRead(field: _MyField) {
    return format(fieldCanReadTSTPL({
        name: `${field.parent}${capitalize(field.name)}`,
        canRead: field.attributes.can.read,
    }));
}

/** CAN CREATE */
export function augmentFieldCanCreate(field: _MyField) {
    return format(fieldCanCreateTSTPL({
        name: `${field.parent}${capitalize(field.name)}`,
        canCreate: field.attributes.can.create,
    }));
}

/** CAN UPDATE */
export function augmentFieldCanUpdate(field: _MyField) {
    return format(fieldCanUpdateTSTPL({
        name: `${field.parent}${capitalize(field.name)}`,
        canUpdate: field.attributes.can.update,
    }));
}
