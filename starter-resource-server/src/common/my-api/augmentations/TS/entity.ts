import { Template, _MyEntity, MyAugmentedFields, _MyFields } from "../../types";
import { format } from "../../format";
import { typeTSTPL, populatedTypeTSTPL, createTSTPL, updateTSTPL, iterableTSTPL, canReadTSTPL, canCreateTSTPL, canUpdateTSTPL } from "../../templates/TS/entity";
import { capitalize } from "../../common";
import { CAN } from "../../constantes";

/**
 * 
        type: string;
        create: string;
        update: string;
        iterable: string;
        canRead: string;
        canCreate: string;
        canUpdate: string;
        common: string;
        cans: string;
        middlewares: string;
        controllers: string;
 */

/** TYPE */
export function augmentType(entity: _MyEntity, fields: _MyFields & MyAugmentedFields) {
    return format(typeTSTPL({
        name: capitalize(entity.name),
        fields: Object.values(fields)
            .map(field => field.TS.type)
            .join('\n')
    }));
}

/** POPULATED TYPE */
export function augmentPopulatedType(entity: _MyEntity, fields: _MyFields & MyAugmentedFields) {
    return format(populatedTypeTSTPL({
        name: capitalize(entity.name),
        fields: Object.values(fields)
            .map(field => field.TS.populatedType)
            .join('\n')
    }));
}

/** CREATE */
export function augmentCreate(entity: _MyEntity, fields: _MyFields & MyAugmentedFields) {
    return format(createTSTPL({
        name: capitalize(entity.name),
        fields: Object.values(fields)
            .filter(field => typeof(field.type) !== 'function' || [Boolean, String, Number, Date, Object].includes(field.type as any))
            .map(field => field.TS.create)
            .join('\n')
    }));
}

/** UPDATE */
export function augmentUpdate(entity: _MyEntity, fields: _MyFields & MyAugmentedFields) {
    return format(updateTSTPL({
        name: capitalize(entity.name),
        fields: Object.values(fields)
            .filter(field => typeof(field.type) !== 'function' || [Boolean, String, Number, Date, Object].includes(field.type as any))
            .map(field => field.TS.update)
            .join('\n')
    }));
}

/** ITERABLE */
export function augmentIterable(entity: _MyEntity, fields: _MyFields & MyAugmentedFields) {
    return format(iterableTSTPL({
        name: capitalize(entity.name),
        fields: Object.values(fields)
            .filter(field => field.attributes.isArray)
            .map(field => field.TS.iterable)
            .join('\n')
    }));
}

/** CAN READ */
export function augmentCanRead(entity: _MyEntity, fields: _MyFields & MyAugmentedFields) {
    return format(canReadTSTPL({
        name: capitalize(entity.name),
        fields: Object.values(fields)
            .filter(field => field.attributes.can.read)
            .map(field => field.TS.canRead.replace(/export const ([\s\S]*);/g, '    $1,'))
            .join('\n')
    }));
}

/** CAN CREATE */
export function augmentCanCreate(entity: _MyEntity, fields: _MyFields & MyAugmentedFields) {
    return format(canCreateTSTPL({
        name: capitalize(entity.name),
        fields: Object.values(fields)
            .filter(field => field.attributes.can.create && ((typeof(field.type) !== 'function') || [Boolean, String, Number, Date, Object].includes(field.type as any)))
            .map(field => field.TS.canCreate.replace(/export const ([\s\S]*);/g, '    $1,'))
            .join('\n')
    }));
}

/** CAN UPDATE */
export function augmentCanUpdate(entity: _MyEntity, fields: _MyFields & MyAugmentedFields) {
    return format(canUpdateTSTPL({
        name: capitalize(entity.name),
        fields: Object.values(fields)
            .filter(field => field.attributes.can.update && ((typeof(field.type) !== 'function') || [Boolean, String, Number, Date, Object].includes(field.type as any)))
            .map(field => field.TS.canUpdate.replace(/export const ([\s\S]*);/g, '    $1,'))
            .join('\n')
    }));
}
