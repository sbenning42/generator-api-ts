
import fs from 'fs';
import { CRUDSchemaInput, APIGenerator } from './core';
import { templates } from './templates';

export interface APITemplates {
    Cname: string,
    cname: string,
    typeTpl: string;
    createInputTpl: string;
    updateInputTpl: string;
    schemaTpl: string;
    utilsTpl: string;
    relationUtilsTpls: string;
    middlewareTpls: string;
    relationMiddlewareTpls: string;
    controllerTpls: string;
    relationControllerTpls: string;
    skippedRouterTpl: string;
};

export function generateAll(
    schemas: CRUDSchemaInput[],
    path: string,
    backup: boolean = true,
) {

    const G = new APIGenerator;
    const prefix = templates.TS_Prefix;
    const suffix = templates.TS_Suffix;
    const generations = schemas.map(schema => G.generate(schema)[1] as APITemplates);

    const types = generations.map(generation => {
        const {
            Cname,
            typeTpl,
            createInputTpl,
            updateInputTpl,
            schemaTpl,
        } = generation;
        return {
            Cname, tpl: `
${typeTpl}
            
${createInputTpl}
            
${updateInputTpl}
            
${schemaTpl}
            `.trim(),

        };
    });

    const modules = generations.map(generation => {
        const {
            Cname,
            utilsTpl,
            relationUtilsTpls,
            middlewareTpls,
            relationMiddlewareTpls,
            controllerTpls,
            relationControllerTpls,
            skippedRouterTpl
        } = generation;
        return {
            Cname, tpl: `
import {
    ${Cname},
    ${Cname}CreateInput,
    ${Cname}ChangesInput,
    ${Cname}UpdateInput,
    pick${Cname}CreateInput,
    pick${Cname}ChangesInput,
    ${Cname}Model,
} from '../types';

/**
 * Utilitaries
 */

${utilsTpl}

${relationUtilsTpls}

/**
 * Middlewares
 */

${middlewareTpls}

${relationMiddlewareTpls}

/**
 * Controllers
 */

${controllerTpls}

${relationControllerTpls}

${skippedRouterTpl}
        `.trim()
        };
    });

    const typesStr = types.reduce((all, { tpl, Cname }) => `${all ? `${all}\n` : ''}\n/**********     ${Cname.toUpperCase()}     **********/\n\n\n${tpl}`, '');

    if (backup && fs.existsSync(path)) {
        function backupAll() {
            try {
                const old = fs.readFileSync(`${path}/types.ts`, 'utf8');
                const olds = modules.map(({ Cname, tpl }) => {
                    return fs.readFileSync(`${path}/${Cname.toLowerCase()}/${Cname.toLowerCase()}.ts`, 'utf8');
                });
                olds.push(old);
                if (olds && olds.length > 0) {
                    fs.writeFileSync(`${path}/ALL.ts.${Date.now()}.bk`, olds.reduce((str, s) => `${str}${s}`), { encoding: 'utf8', flag: 'w' });
                }
            } catch (error) {
                return console.error('[1] Something Went wrong.', error);                
            }
        }
        backupAll();
    }

    const generated = [];

    try {
        fs.writeFileSync(`${path}/types.ts`, prefix + typesStr, { encoding: 'utf8', flag: 'w' });
        generated.push(`\nGenerated ${BrightCCC}TS types${ResetCCC} at => ${UnderscoreCCC}${path}/types.ts${ResetCCC}`);
        modules.forEach(({ Cname, tpl }) => {
            const name = `\n/**********     ${Cname.toUpperCase()}     **********/\n\n\n`;
            if (!fs.existsSync(`${path}/${Cname.toLowerCase()}`)) {
                fs.mkdirSync(`${path}/${Cname.toLowerCase()}`, 0o755);
            }
            fs.writeFileSync(`${path}/${Cname.toLowerCase()}/${Cname.toLowerCase()}.ts`, prefix + name + tpl + '\n' + suffix + '\n', { encoding: 'utf8', flag: 'w' });
            generated.push(`Generated ${BrightCCC}API${ResetCCC} for ${BrightCCC}module${ResetCCC} ${BrightCCC}${FgBlueCCC}${Cname}${ResetCCC} at => ${UnderscoreCCC}${path}/${Cname.toLowerCase()}/${Cname.toLowerCase()}.ts${ResetCCC}`);
        });
    } catch (error) {
        return console.error('[2] Something Went wrong.', error);
    }

    generated.forEach(g => console.log(g + '\n'));

}

export const ResetCCC = "[0m";
export const BrightCCC = "[1m";
export const DimCCC = "[2m";
export const UnderscoreCCC = "[4m";
export const BlinkCCC = "[5m";
export const ReverseCCC = "[7m";
export const HiddenCCC = "[8m";
export const FgBlackCCC = "[30m";
export const FgRedCCC = "[31m";
export const FgGreenCCC = "[32m";
export const FgYellowCCC = "[33m";
export const FgBlueCCC = "[34m";
export const FgMagentaCCC = "[35m";
export const FgCyanCCC = "[36m";
export const FgWhiteCCC = "[37m";
export const BgBlackCCC = "[40m";
export const BgRedCCC = "[41m";
export const BgGreenCCC = "[42m";
export const BgYellowCCC = "[43m";
export const BgBlueCCC = "[44m";
export const BgMagentaCCC = "[45m";
export const BgCyanCCC = "[46m";
export const BgWhiteCCC = "[47m";

export function colorVerb(verb: string) {
    switch (verb) {
        case 'GET':
            return `${BrightCCC}${FgBlueCCC}GET${ResetCCC}`;
        case 'POST':
            return `${BrightCCC}${FgGreenCCC}POST${ResetCCC}`;
        case 'PUT':
            return `${BrightCCC}${FgYellowCCC}PUT${ResetCCC}`;
        case 'DELETE':
            return `${BrightCCC}${FgRedCCC}DELETE${ResetCCC}`;
        default:
            return verb;
    }
}
export function colorPath(path: string) {
    const parts = path.split('/').slice(1);
    parts[0] = `${UnderscoreCCC}${BrightCCC}${parts[0]}${ResetCCC}${UnderscoreCCC}`;
    if (parts[1]) {
        parts[1] = `${UnderscoreCCC}${FgBlueCCC}${parts[1]}${ResetCCC}${UnderscoreCCC}`;
    }
    if (parts[2]) {
        parts[2] = `${UnderscoreCCC}${BrightCCC}${FgYellowCCC}${parts[2]}${ResetCCC}${UnderscoreCCC}`;
    }
    if (parts[3] && parts[3] === 'add') {
        parts[3] = `${UnderscoreCCC}${FgGreenCCC}${parts[3]}${ResetCCC}${UnderscoreCCC}`;
    } else if (parts[3] && parts[3] === 'remove') {
        parts[3] = `${UnderscoreCCC}${FgRedCCC}${parts[3]}${ResetCCC}${UnderscoreCCC}`;
    }
    return `${UnderscoreCCC}${parts.join('/')}${ResetCCC}`;
}
