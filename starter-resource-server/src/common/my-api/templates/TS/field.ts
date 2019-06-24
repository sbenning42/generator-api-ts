import { Template, _MyCanType } from "../../types";
import { assumeInScopeFunction } from "../../common";

/** TYPE */
export interface FieldTypeTSTPLArgs {
    name: string;
    type: string;
    required?: boolean|string;
    array?: boolean|string;
}
export const _fieldTypeTSTPL = `    $name$required: $type$array;`;
export function fieldTypeTSTPL({ name, type, required = false, array = false }: FieldTypeTSTPLArgs) {
    return { template: _fieldTypeTSTPL, name, type, required: required ? '' : '?', array: array ? '[]' : '' } as Template<FieldTypeTSTPLArgs>;
}

/** POPULATED TYPE */
export interface FieldPopulatedTypeTSTPLArgs {
    name: string;
    type: string;
    required?: boolean|string;
    array?: boolean|string;
}
export const _fieldPopulatedTypeTSTPL = `    $name$required: $type$array;`;
export function fieldPopulatedTypeTSTPL({ name, type, required = false, array = false }: FieldPopulatedTypeTSTPLArgs) {
    return { template: _fieldPopulatedTypeTSTPL, name, type, required: required ? '' : '?', array: array ? '[]' : '' } as Template<FieldPopulatedTypeTSTPLArgs>;
}

/** CREATE */
export interface FieldCreateTSTPLArgs {
    name: string;
    type: string;
    required?: boolean|string;
    array?: boolean|string;
}
export const _fieldCreateTSTPL = `    $name$required: $type$array;`;
export function fieldCreateTSTPL({ name, type, required = false, array = false }: FieldCreateTSTPLArgs) {
    return { template: _fieldCreateTSTPL, name, type, required: required ? '' : '?', array: array ? '[]' : '' } as Template<FieldCreateTSTPLArgs>;
}

/** UPDATE */
export interface FieldUpdateTSTPLArgs {
    name: string;
    type: string;
    array?: boolean|string;
}
export const _fieldUpdateTSTPL = `    $name?: $type$array;`;
export function fieldUpdateTSTPL({ name, type, array = false }: FieldUpdateTSTPLArgs) {
    return { template: _fieldUpdateTSTPL, name, type, array: array ? '[]' : '' } as Template<FieldUpdateTSTPLArgs>;
}

/** ITERABLE */
export interface FieldIterableTSTPLArgs {
    name: string;
    type: string;
}
export const _fieldIterableTSTPL = `    $name?: $type[];`;
export function fieldIterableTSTPL({ name, type }: FieldIterableTSTPLArgs) {
    return { template: _fieldIterableTSTPL, name, type } as Template<FieldIterableTSTPLArgs>;
}


/** CAN READ */
export interface FieldCanReadTSTPLArgs {
    name: string;
    canRead?: _MyCanType|string;
}
export const _fieldCanReadTSTPL = `
export const $nameCanRead = $canRead;
`;
export function fieldCanReadTSTPL({ name, canRead }: FieldCanReadTSTPLArgs) {
    return { template: _fieldCanReadTSTPL, name, canRead: assumeInScopeFunction(canRead as _MyCanType) } as Template<FieldCanReadTSTPLArgs>;
}

/** CAN CREATE */
export interface FieldCanCreateTSTPLArgs {
    name: string;
    canCreate?: _MyCanType|string;
}
export const _fieldCanCreateTSTPL = `
export const $nameCanCreate = $canCreate;
`;
export function fieldCanCreateTSTPL({ name, canCreate }: FieldCanCreateTSTPLArgs) {
    return { template: _fieldCanCreateTSTPL, name, canCreate: assumeInScopeFunction(canCreate as _MyCanType) } as Template<FieldCanCreateTSTPLArgs>;
}

/** CAN UPDATE */
export interface FieldCanUpdateTSTPLArgs {
    name: string;
    canUpdate?: _MyCanType|string;
}
export const _fieldCanUpdateTSTPL = `
export const $nameCanUpdate = $canUpdate;
`;
export function fieldCanUpdateTSTPL({ name, canUpdate }: FieldCanUpdateTSTPLArgs) {
    return { template: _fieldCanUpdateTSTPL, name, canUpdate: assumeInScopeFunction(canUpdate as _MyCanType) } as Template<FieldCanUpdateTSTPLArgs>;
}
