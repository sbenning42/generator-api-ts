import dotenv from 'dotenv';
import { environment as development } from './dev';
import { environment as production } from './prod';

dotenv.config();

const {
    NODE_ENV,
} = process.env;

export const environment = {
    ...process.env,
    ...(NODE_ENV === 'development' ? development : production)
};
