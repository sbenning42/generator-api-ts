import pino from 'pino';
import { environment } from '../../environment';

const {
    LOGGER_NAME: name = 'Express Application',
    LOGGER_LEVEL: level = 'debug'
} = environment;

export const L = pino({ name, level });
