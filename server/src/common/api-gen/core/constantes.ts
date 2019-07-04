import { ObjectID } from 'mongodb';
import mongoose from 'mongoose';

export type ID = string | number | ObjectID;
export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

export const Pr = (thing: any) => Promise.resolve(thing);

// Validators
export const REQUIRED = (ctx: any, input: string) => Pr(![null, undefined].includes(input) ? null : { required: 'Input is required.' });
export const MINLENGTH = (length: number) => (ctx: any, input: string) => Pr(input && input.length > length ? null : { minLength: 'Input too short.' + input });
export const MAXLENGTH = (length: number) => (ctx: any, input: string) => Pr(input && input.length < length ? null : { maxLength: 'Input too long.' + input });
export const MIN = (min: number) => (ctx: any, input: number) => Pr(input && input > min ? null : { minLength: 'Input too little.' });
export const MAX = (max: number) => (ctx: any, input: number) => Pr(input && input < max ? null : { minLength: 'Input too big.' });

// Guards
export const NEVER = [() => Pr({ unauthorized: 'unauthorized' })];
export const ALWAYS = [() => Pr(null)];
export const ADMIN = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'admin' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];
export const SELF = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'self' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];
export const OWNER = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'owner' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];