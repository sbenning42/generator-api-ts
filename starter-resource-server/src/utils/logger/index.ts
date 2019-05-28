import pino from 'pino';

const {
    LOGGER_NAME: name = 'Express Application',
    LOGGER_LEVEL: level = 'debug'
} = process.env;

export const l = pino({ name, level });
