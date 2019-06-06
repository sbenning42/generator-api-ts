import { Mixed } from "../types";

export const rep = (tpl: string, args: { [key: string]: string }) => {
    return Object.entries(args)
        .map(([key, value]) => {
            const reg = new RegExp(`\\$${key}`, 'g');
            return [reg, value] as [RegExp, string];
        })
        .reduce((_tpl, [reg, value]) => {
            return _tpl.replace(reg, value);
        }, tpl);
};

export const GQLSchemaTpl = (args: any) => rep(`
$types
$inputs
$queries
$mutations
`,  args);

export const GQLTypeTpl = (args: any) => rep(`
type $name {
$properties
}
`, args);

export const GQLInputTpl = (args: any) => rep(`
input _$name {
$properties
}
`, args);

export const GQLQueriesTpl = (args: any) => rep(`
type Query {
$properties
}
`, args);

export const GQLMutationsTpl = (args: any) => rep(`
type Mutation {
$properties
}
`, args);

export const GQLTypePropertyTypeTpl = (type: any, isArray: boolean = false, isRequired: boolean = false, ref: string) => {
    switch (true) {
        case type === Boolean:
            return isArray ? `[Boolean]${isRequired ? '!' : ''}` : `Boolean${isRequired ? '!' : ''}`;
        case type === String:
            return isArray ? `[String]${isRequired ? '!' : ''}` : `String${isRequired ? '!' : ''}`;
        case type === Number:
            return isArray ? `[Number]${isRequired ? '!' : ''}` : `Number${isRequired ? '!' : ''}`;
        case type === Mixed:
            return isArray ? `[JSON]${isRequired ? '!' : ''}` : `JSON${isRequired ? '!' : ''}`;
        case type === Date:
            return isArray ? `[Date]${isRequired ? '!' : ''}` : `Date${isRequired ? '!' : ''}`;
        case ref !== undefined:
            return isArray ? `[${ref}]${isRequired ? '!' : ''}` : `${ref}${isRequired ? '!' : ''}`;
        default:
            throw new Error(`Unknow type ${type}`);
    }
};

export const GQLTypePropertyTpl = (args: any) => rep(`  $name: $type`, args);

export const GQLInputPropertyTpl = (args: any) => rep(`  $name: $type`, args);

export const GQLQueryPropertyTpl = (args: any) => rep(`  $name: $type`, args);
export const GQLQueryPropertyWithArgsTpl = (args: any) => rep(`  $name($args): $type`, args);

export const GQLMutationPropertyTpl = (args: any) => rep(`  $name: $type`, args);
export const GQLMutationPropertyWithArgsTpl = (args: any) => rep(`  $name($args): $type`, args);
