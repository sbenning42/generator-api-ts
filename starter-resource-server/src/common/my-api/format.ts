import { Template } from "./types";

export function format<Args extends {}>({ template, ...args }: Template<Args>) {
    return Object.entries(args || { _: '' })
        .map(([name, value]) => [
            new RegExp(`\\$${name}`, 'g'),
            value
        ] as [RegExp, string])
        .reduce((tmp, [name, value]) => tmp.replace(name, value), template)
        ;
}
