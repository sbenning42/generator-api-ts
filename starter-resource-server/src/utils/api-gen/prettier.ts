import { _APISchema, Mixed, ObjectId, _APISchemaEntityPropertyTyped, _APISchemaEntityRoute } from "./types";
import { Router } from 'express';
const {
    PRETTY_COL = 'true',
    PRETTY_LOG = 'true'
} = process.env;

const isCol = () => PRETTY_COL === 'true';
const isLog = () => PRETTY_LOG === 'true';

export const ResetCCC = isCol() ? '\x1b[0m' : '';
export const BrightCCC = isCol() ? '\x1b[1m' : '';
export const DimCCC = isCol() ? '\x1b[2m' : '';
export const UnderscoreCCC = isCol() ? '\x1b[4m' : '';
export const BlinkCCC = isCol() ? '\x1b[5m' : '';
export const ReverseCCC = isCol() ? '\x1b[7m' : '';
export const HiddenCCC = isCol() ? '\x1b[8m' : '';
export const FgBlackCCC = isCol() ? '\x1b[90m' : '';
export const FgRedCCC = isCol() ? '\x1b[31m' : '';
export const FgGreenCCC = isCol() ? '\x1b[32m' : '';
export const FgYellowCCC = isCol() ? '\x1b[33m' : '';
export const FgBlueCCC = isCol() ? '\x1b[34m' : '';
export const FgMagentaCCC = isCol() ? '\x1b[35m' : '';
export const FgCyanCCC = isCol() ? '\x1b[36m' : '';
export const FgWhiteCCC = isCol() ? '\x1b[37m' : '';
export const BgBlackCCC = isCol() ? '\x1b[40m' : '';
export const BgRedCCC = isCol() ? '\x1b[41m' : '';
export const BgGreenCCC = isCol() ? '\x1b[42m' : '';
export const BgYellowCCC = isCol() ? '\x1b[43m' : '';
export const BgBlueCCC = isCol() ? '\x1b[44m' : '';
export const BgMagentaCCC = isCol() ? '\x1b[45m' : '';
export const BgCyanCCC = isCol() ? '\x1b[46m' : '';
export const BgWhiteCCC = isCol() ? '\x1b[47m' : '';

export function prettifySchema(schema: _APISchema, L: { log: (...args: any[]) => void }) {
    if (!isLog()) {
        return;
    }
    const
        res = ResetCCC,
        bold = BrightCCC,
        line = UnderscoreCCC,
        red = FgRedCCC,
        green = FgGreenCCC,
        blue = FgBlueCCC,
        yellow = FgYellowCCC,
        black = FgBlackCCC;
    const cat = (strs: string[]) => strs.reduce((str, s) => `${str}${s}`, '');
    const cap = (s: string) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
    const pad = (tab: number) => tab ? `    ${pad(tab - 1)}` : '';
    const pretty = (thing: string, before: string[] = [], tab: number = 0, after: string[] = [res]) =>
        `${pad(tab)}${cat(before)}${thing}${cat(after)}`;
    const {
        config: { outDir, backupOutDir, auth: { secret, defaultScopes } }, 
        entities,
    } = schema;
    const stringifyType = (type: any, ia: boolean = false) => {
        const str = (s: string) => ia ? `[${s}]` : s;
        switch (true) {
            case type === Boolean:
                return str('Boolean');
            case type === Number:
                return str('Number');
            case type === String:
                return str('String');
            case type === Date:
                return str('Date');
            case type === Mixed:
                return str('Mixed');
            case type === ObjectId:
                return str('ObjectId');
            default:
                return str('Unknow');
        }
    };
    const prettyEndpoint = (endpoint: string, base: string = '') => {
        if (['all', 'query', 'mutation'].includes(endpoint)) {
            return `${pretty(endpoint, [bold])}`;
        }
        const [verb, _ep] = endpoint.split(' ');
        const ep = base ? `/${base}${_ep}` : _ep;
        let prettyVerb: string;
        switch (verb) {
            case 'POST':
                prettyVerb = pretty(verb, [bold, green]);
                break;
            case 'PUT':
                prettyVerb = pretty(verb, [bold, yellow]);
                break;
            case 'DELETE':
                prettyVerb = pretty(verb, [bold, red]);
                break;
            case 'GET':
            default:
                prettyVerb = pretty(verb, [bold, blue]);
                break;
        }
        const eps = ep.split('/').filter(e => e !== undefined && e !== null && e !== '');
        const prettyEps = eps.map((e, i) => {
            switch (true) {
                case e === ':id':
                    return pretty(e, [bold, blue]);
                case e === 'add':
                    return pretty(e, [bold, yellow]);
                case e === 'remove':
                    return pretty(e, [bold, red]);
                case i === 0:
                    return pretty(e + 's', [bold, green]);
                case i === 2:
                    return pretty(e, [green]);
            }
            return e;
        });
        const prettyEp = `/${prettyEps.join(`/`)}`;
        return `${prettyVerb} ${prettyEp}`;
    };
    L.log(`${
        pretty(`APIGen @ prettify Schema:`, [bold, line])
    } ${
        `(set \`PRETTY_LOG=false\` in \`.env\` file to disable prettify ${bold + red}:(${res}  )`
    }\n\n${
        pretty(`Config:`, [bold, line])
    }\n${
        pretty(`Out directory:`, [black], 1)
    } ${
        pretty(outDir, [bold, blue])
    }\n${
        pretty(`Backup directory:`, [black], 1)
    } ${
        backupOutDir ? pretty(backupOutDir, [bold, green]) : pretty('No backups', [bold, red])
    }\n${
        pretty(`Auth:`, [bold, line])
    }\n${
        pretty(`Secret:`, [black], 1)
    } ${
        secret && secret !== 'secret'
            ? pretty('***', [bold, green])
            : (
                secret ? pretty(secret, [bold, yellow]) : pretty('No secret', [bold, red])
            )
    }\n${
        pretty(`Default scopes:`, [black], 1)
    } ${
        defaultScopes ? pretty('true', [bold, green]) : pretty('false', [bold, red])
    }\n${
        pretty(`Entities:`, [bold, line])
    }\n${
        Object.entries(entities)
            .map(([entityName, entity]) => `\n${
                pretty(`***** ${cap(entityName)} *****`, [bold], 1)
            }\n\n${
                Object.entries(entity.properties)
                    .map(([propName, property]) => [propName, Array.isArray(property) ? property[0] : property])
                    .map(([propName, {
                        type, ref, required, unique, hidden, skipChanges, skipCreate, default: _default
                    }]: [string, _APISchemaEntityPropertyTyped]) => `${
                        pretty(`${propName}: `, [bold], 2)
                    }\n${
                        pretty('Type:', [black], 3)
                    } ${
                        pretty(stringifyType(type), [bold, blue])
                    }${
                        ref
                            ? `\n${
                                pretty('Ref:', [black], 3)
                            } ${
                                pretty(ref, [bold, yellow])
                            }` : ''
                    }\n${
                        pretty('Required:', [black], 3)
                    } ${
                        pretty(required.toString(), [bold, required ? green : red])
                    }\n${
                        pretty('Unique:', [black], 3)
                    } ${
                        pretty(unique.toString(), [bold, unique ? green : red])
                    }\n${
                        pretty('Hidden:', [black], 3)
                    } ${
                        pretty(hidden.toString(), [bold, hidden ? green : red])
                    }\n${
                        pretty('Skip Create:', [black], 3)
                    } ${
                        pretty(skipCreate.toString(), [bold, skipCreate ? green : red])
                    }\n${
                        pretty('Skip Changes:', [black], 3)
                    } ${
                        pretty(skipChanges.toString(), [bold, skipChanges ? green : red])
                    }${
                        _default
                            ? `\n${
                                pretty('Default:', [black], 3)
                            } ${
                                pretty(typeof(_default) === 'string' ? _default : JSON.stringify(_default).slice(0, 50), [bold])
                            }`
                            : ''
                    }`).join('\n')
            }\n${
                Object.entries(entity.routes)
                    .map(([endpoint, route]) => [endpoint, Array.isArray(route) ? route[0] : route])
                    .map(([endpoint, {
                        skip, middlewares, auth: { private: _private, roles, scopes }
                    }]: [string, _APISchemaEntityRoute]) => `\n${
                        pretty(`${res}${prettyEndpoint(endpoint, entityName)}${bold}:`, [bold], 2)
                    }\n\n${
                        pretty(`Skip: `, [bold, black], 3)
                    } ${
                        pretty(skip.toString(), [bold, skip ? green : red])
                    }\n${
                        pretty(`Private: `, [bold, black], 3)
                    } ${
                        pretty(_private.toString(), [bold, _private ? green : red])
                    }\n${
                        pretty(`Roles: `, [bold, black], 3)
                    } ${
                        pretty(`[${roles.toString()}]`, [bold, yellow])
                    }\n${
                        pretty(`Scopes: `, [bold, black], 3)
                    } ${
                        pretty(`[${scopes.toString()}]`, [bold, yellow])
                    }\n${
                        pretty(`Middlewares: `, [bold, black], 3)
                    } ${
                        pretty(`[${middlewares.toString()}]`, [bold, yellow])
                    }`).join('\n')
            }`).join('\n')
    }
    `
    );
}

export function prettifyRouter(name: string, router: Router, L: { log: (...args: any[]) => void }) {
    if (!isLog()) {
        return;
    }
    const
        res = ResetCCC,
        bold = BrightCCC,
        line = UnderscoreCCC,
        red = FgRedCCC,
        green = FgGreenCCC,
        blue = FgBlueCCC,
        yellow = FgYellowCCC,
        black = FgBlackCCC;
    const cat = (strs: string[]) => strs.reduce((str, s) => `${str}${s}`, '');
    const cap = (s: string) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
    const pad = (tab: number) => tab ? `    ${pad(tab - 1)}` : '';
    const pretty = (thing: string, before: string[] = [], tab: number = 0, after: string[] = [res]) =>
        `${pad(tab)}${cat(before)}${thing}${cat(after)}`;
    const stringifyType = (type: any, ia: boolean = false) => {
        const str = (s: string) => ia ? `[${s}]` : s;
        switch (true) {
            case type === Boolean:
                return str('Boolean');
            case type === Number:
                return str('Number');
            case type === String:
                return str('String');
            case type === Date:
                return str('Date');
            case type === Mixed:
                return str('Mixed');
            case type === ObjectId:
                return str('ObjectId');
            default:
                return str('Unknow');
        }
    };
    const prettyEndpoint = (endpoint: string, base: string = '') => {
        if (['all', 'query', 'mutation'].includes(endpoint)) {
            return `${pretty(endpoint, [bold])}`;
        }
        const [verb, _ep] = endpoint.split(' ');
        const ep = base ? `/${base}${_ep}` : _ep;
        let prettyVerb: string;
        switch (verb) {
            case 'POST':
                prettyVerb = pretty(verb, [bold, green]);
                break;
            case 'PUT':
                prettyVerb = pretty(verb, [bold, yellow]);
                break;
            case 'DELETE':
                prettyVerb = pretty(verb, [bold, red]);
                break;
            case 'GET':
            default:
                prettyVerb = pretty(verb, [bold, blue]);
                break;
        }
        const eps = ep.split('/').filter(e => e !== undefined && e !== null && e !== '');
        const prettyEps = eps.map((e, i) => {
            switch (true) {
                case e === ':id':
                    return pretty(e, [bold, blue]);
                case e === 'add':
                    return pretty(e, [bold, yellow]);
                case e === 'remove':
                    return pretty(e, [bold, red]);
                case i === 0:
                    return pretty(e, [bold, green]);
                case i === 2:
                    return pretty(e, [green]);
            }
            return e;
        });
        const prettyEp = `/${prettyEps.join(`/`)}`;
        return `${prettyVerb} ${prettyEp}`;
    };
    console.log(`***********     ${BrightCCC}${name.toUpperCase()}${ResetCCC}     ***********`);
    console.log('\n');
    router.stack.forEach(({ route: { path, methods } }) => console.log(
        prettyEndpoint(`${Object.keys(methods)[0].toUpperCase()} /${name}${path}`)
    ));
    console.log('\n\n');
    return;
}