import _pluralize from 'pluralize';
import { _MyCanType } from './types';

export function capitalize(s: string) {
    return `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
}

export function pluralize(s: string, n: number = 42) {
    return _pluralize(s, n);
}

export function singularize(s: string, n: number = 1) {
    return _pluralize(s, n);
}

export function closeAroundFunction(can: _MyCanType, name: string, inContext: string[]) {
    return `
export function ${name}(thisContext: any = {}) {
    const {
${inContext.map(s => `        ${s},`).join('\n')}
    } = thisContext;
    return ${can.toString()};
}
    `;
}

export function assumeInScopeFunction(can: _MyCanType) {
    return can.toString().replace(/\w*_\d*\./g, '');
}
