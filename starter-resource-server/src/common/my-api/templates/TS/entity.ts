import { Template } from "../../types";

/**
 * 
        type: string;
        populatedType: string;
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
export interface TypeTSTPLArgs {
    name: string;
    fields: string;
}
export const _typeTSTPL = `
export interface $name {
$fields
}
`;
export function typeTSTPL({ name, fields }: TypeTSTPLArgs) {
    return { template: _typeTSTPL, name, fields } as Template<TypeTSTPLArgs>;
}

/** POPULATED TYPE */
export interface PopulatedTypeTSTPLArgs {
    name: string;
    fields: string;
}
export const _populatedTypeTSTPL = `
export interface $namePopulated {
$fields
}
`;
export function populatedTypeTSTPL({ name, fields }: PopulatedTypeTSTPLArgs) {
    return { template: _populatedTypeTSTPL, name, fields } as Template<PopulatedTypeTSTPLArgs>;
}

/** CREATE */
export interface CreateTSTPLArgs {
    name: string;
    fields: string;
}
export const _createTSTPL = `
export interface $nameCreatePayload {
    id?: ID;
$fields
}
`;
export function createTSTPL({ name, fields }: CreateTSTPLArgs) {
    return { template: _createTSTPL, name, fields } as Template<CreateTSTPLArgs>;
}

/** UPDATE */
export interface UpdateTSTPLArgs {
    name: string;
    fields: string;
}
export const _updateTSTPL = `
export interface $nameUpdatePayload {
    id: ID;
    push?: $nameIterablePayload;
    pull?: $nameIterablePayload;
$fields
}
`;
export function updateTSTPL({ name, fields }: UpdateTSTPLArgs) {
    return { template: _updateTSTPL, name, fields } as Template<UpdateTSTPLArgs>;
}

/** ITERABLE */
export interface IterableTSTPLArgs {
    name: string;
    fields: string;
}
export const _iterableTSTPL = `
export interface $nameIterablePayload {
$fields
}
`;
export function iterableTSTPL({ name, fields }: IterableTSTPLArgs) {
    return { template: _iterableTSTPL, name, fields } as Template<IterableTSTPLArgs>;
}

/** CAN READ */
export interface CanReadTSTPLArgs {
    name: string;
    fields: string;
}
export const _canReadTSTPL = `
export const $nameCanReads {
$fields
}
`;
export function canReadTSTPL({ name, fields }: CanReadTSTPLArgs) {
    return { template: _canReadTSTPL, name, fields } as Template<CanReadTSTPLArgs>;
}

/** CAN CREATE */
export interface CanCreateTSTPLArgs {
    name: string;
    fields: string;
}
export const _canCreateTSTPL = `
export const $nameCanCreates {
$fields
}
`;
export function canCreateTSTPL({ name, fields }: CanCreateTSTPLArgs) {
    return { template: _canCreateTSTPL, name, fields } as Template<CanCreateTSTPLArgs>;
}

/** CAN UPDATE */
export interface CanUpdateTSTPLArgs {
    name: string;
    fields: string;
}
export const _canUpdateTSTPL = `
export const $nameCanUpdates {
$fields
}
`;
export function canUpdateTSTPL({ name, fields }: CanUpdateTSTPLArgs) {
    return { template: _canUpdateTSTPL, name, fields: fields } as Template<CanUpdateTSTPLArgs>;
}
