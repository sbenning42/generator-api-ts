import dotenv from 'dotenv';
dotenv.config();

import { environment as development } from './dev';
import { environment as production } from './prod';

const {
    NODE_ENV,
} = process.env;

export const environment = {
    ...process.env as any,
    ...(NODE_ENV === 'development' ? development : production)
};
