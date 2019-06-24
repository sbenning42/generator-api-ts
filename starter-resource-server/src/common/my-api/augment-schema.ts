import fs from 'fs';
import {
    MySchema,
    _MyEntity,
    _MyField,
    _MyService,
    _MySchema,
    MyAugmentedField,
    MyAugmentedService,
    MyAugmentedEntity,
    MyAugmentedFields,
    _MyFields
} from './types';
import { privatise } from './privatise';
import {
    augmentFieldType,
    augmentFieldPopulatedType,
    augmentFieldCreate,
    augmentFieldUpdate,
    augmentFieldIterable,
    augmentFieldCanRead, 
    augmentFieldCanCreate,
    augmentFieldCanUpdate
} from './augmentations/TS/field';
import {
    augmentType,
    augmentPopulatedType,
    augmentCreate,
    augmentUpdate,
    augmentIterable,
    augmentCanRead,
    augmentCanCreate,
    augmentCanUpdate
} from './augmentations/TS/entity';

export function augmentEntityField(_field: _MyField, entity: _MyEntity, schema: _MySchema) {
    const field = _field as any as MyAugmentedField;
    field.TS = {
        type: augmentFieldType(_field),
        populatedType: augmentFieldPopulatedType(_field),
        create: typeof(_field.type) !== 'function' || [Boolean, String, Number, Date, Object].includes(_field.type as any) ? augmentFieldCreate(_field) : '',
        update: typeof(_field.type) !== 'function' || [Boolean, String, Number, Date, Object].includes(_field.type as any) ? augmentFieldUpdate(_field) : '',
        iterable: _field.attributes.isArray ? augmentFieldIterable(_field) : '',
        canRead: _field.attributes.can.read ? augmentFieldCanRead(_field) : '',
        canCreate: _field.attributes.can.create && ((typeof(_field.type) !== 'function') || [Boolean, String, Number, Date, Object].includes(_field.type as any))
            ? augmentFieldCanCreate(_field) : '',
        canUpdate: _field.attributes.can.update && ((typeof(_field.type) !== 'function') || [Boolean, String, Number, Date, Object].includes(_field.type as any))
            ? augmentFieldCanUpdate(_field) : '',
    };
    return field as _MyField & MyAugmentedField;
}
export function augmentEntityService(_service: _MyService, entity: _MyEntity, schema: _MySchema) {
    const service = _service as any as MyAugmentedService;
    service.TS = {
        can: '',
        asMiddleware: '',
        asController: '',
    };
    service.JSON = {
        verb: '',
        path: '',
        definition: '',
    };
    return undefined as _MyService & MyAugmentedService;
}

export function augmentEntity(_entity: _MyEntity, schema: _MySchema) {
    Object.values(_entity.fields).forEach(field => augmentEntityField(field, _entity, schema));
    Object.values(_entity.services).forEach(service => augmentEntityService(service, _entity, schema));
    const entity = _entity as any as MyAugmentedEntity;
    entity.TS = {
        type: augmentType(_entity, _entity.fields as _MyFields & MyAugmentedFields).replace(/\n\n*/g, '\n\n'),
        populatedType: augmentPopulatedType(_entity, _entity.fields as _MyFields & MyAugmentedFields).replace(/\n\n*/g, '\n\n'),
        create: augmentCreate(_entity, _entity.fields as _MyFields & MyAugmentedFields).replace(/\n\n*/g, '\n\n'),
        update: augmentUpdate(_entity, _entity.fields as _MyFields & MyAugmentedFields).replace(/\n\n*/g, '\n\n'),
        iterable: augmentIterable(_entity, _entity.fields as _MyFields & MyAugmentedFields).replace(/\n\n*/g, '\n\n'),
        canRead: augmentCanRead(_entity, _entity.fields as _MyFields & MyAugmentedFields).replace(/\n\n*/g, '\n\n'),
        canCreate: augmentCanCreate(_entity, _entity.fields as _MyFields & MyAugmentedFields).replace(/\n\n*/g, '\n\n'),
        canUpdate: augmentCanUpdate(_entity, _entity.fields as _MyFields & MyAugmentedFields).replace(/\n\n*/g, '\n\n'),
        common: '',
        cans: '',
        middlewares: '',
        controllers: '',
    };
}

export function augmentSchema(schema: MySchema, basePath: string = './src/generated') {
    const _schema = privatise(schema);
    const str = JSON.stringify(_schema, undefined, 2);
    console.log('Schema: ', str);
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { mode: 0o755 });
    }
    fs.writeFileSync(`${basePath}/raw-schema.json`, str, { mode: 0o644, flag: 'w' });
    const augmentedSchema = { ..._schema };
    Object.values(augmentedSchema.entities).forEach(entity => augmentEntity(entity, _schema));
    const augmentedStr = JSON.stringify(augmentedSchema, undefined, 2);
    console.log('Augmented Schema: ', augmentedStr);
    fs.writeFileSync(`${basePath}/raw-augmented-schema.json`, augmentedStr, { mode: 0o644, flag: 'w' });
}