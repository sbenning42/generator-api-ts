// function to replace `$<index>` occurencies in `s` by corresponding `args[index]`
export const rep = (s: string, args: string[] = []) => args.reduce((str, arg, idx) => str.replace(new RegExp(`\\$${idx}`, 'g'), arg), s);

export const epExpress2Swagger = (ep: string, vars: { [key: string]: string } = {}) => {
    if (ep[ep.length - 1] === '/') {
        ep = ep.slice(0, -1);
    }
    return Object.keys(vars).length > 0
        ? Object.entries(vars).reduce((e, [k, v]) => ep.replace(new RegExp(`:${k}`), `{${k}}`), ep)
        : ep;
};

export const YMLDefinitionPropPrimTpl = (name: string, type: string) => rep(`
            $0:
                type: $1`, [name, type]);
export const YMLDefinitionPropObjTpl = (name: string) => rep(`
            $0:
                type: object`, [name]);
export const YMLDefinitionPropRelTpl = (name: string, ref: string, force = false) => rep(`
            $0:
                $1`, [name, force ? `$ref: '#/definitions/${ref}'` : `type: string`]);
export const YMLDefinitionPropPrimArrayTpl = (name: string, type: string) => rep(`
            $0:
                type: array
                items:
                    type: $1`, [name, type]);
export const YMLDefinitionPropObjArrayTpl = (name: string) => rep(`
            $0:
                type: array
                items:
                    type: object`, [name]);
export const YMLDefinitionPropRelArrayTpl = (name: string, ref: string, force = false) => rep(`
            $0:
                type: array
                items:
                    $1`, [name, force ? `$ref: '#/definitions/${ref}'` : `type: string`]);

export const YMLDefinitionTypeTpl = (capName: string, props: string) => props ? rep(`    $0:
        type: object
        properties:$1`, [capName, props]) : rep(`    $0:
        type: object`, [capName]);

export const YMLDefinitionTpl = (props: string) => rep(`
definitions:
$0
`, [props]);




export const YMLGetEndpoints = (routes: any) => {
    const verbs = ['GET', 'POST', 'PUT', 'DELETE'];
    const entries = Object.entries(routes).filter(([k]) => verbs.includes(k.split(' ')[0].toUpperCase()));
    const splitEntries = entries.map(([k, v]) => {
        const [_verb, _ep] = k.split(' ');
        return [k, _verb.trim().toUpperCase(), _ep.trim(), v] as [string, string, string, any];
    });
    const already = [];
    splitEntries.forEach(([key, verb, ep, route]) => {
        let ent = already.find(a => a.ep === ep);
        if (!ent) {
            ent = { ep, entries: {} };
            already.push(ent);
        }
        ent.entries[verb] = { key, verb, ep, route };
    });
    return already;
}


export const YMLPathsEntityTpl = (endpoint: string, props: string) => rep(`    $0:$1
`, [endpoint, props]);

export const YMLPathsEntityVerbTpl = (ep: string) => (verb: string, vars: string, resps: string, desc: string = '', sec: boolean = false) => vars && resps ? rep(`
        $0:$5
            tags: ['$4']
            description: "$1"
            parameters:$2
            responses:
                '200':
                    description: "not provided."
                    schema:$3`, [verb, desc, vars, resps, ep.split('/')[0], sec ? YMLsecureTPL() : ''])
        : (vars ? rep(`
        $0:$4
            tags: ['$3']
            description: "$1"
            parameters:$2
            responses:
                '200':
                    description: "not provided."
                    schema:
                        type: object`, [verb, desc, vars, ep.split('/')[0], sec ? YMLsecureTPL() : ''])
        : (resps ? rep(`
        $0:$4
            tags: ['$3']
            description: "$1"
            responses:
                '200':
                    description: "not provided."
                    schema:$2`, [verb, desc, resps, ep.split('/')[0], sec ? YMLsecureTPL() : ''])
        : rep(`
        $0:$3
            tags: ['$2']
            description: "$1"
            responses:
                '200':
                    description: "not provided."
                    schema:
                        type: object`, [verb, desc, ep.split('/')[0], sec ? YMLsecureTPL() : '']))
        );

export const YMLPathsEntityVerbVarsTpl = (name: string, desc: string) => rep(`
                - name: $0
                  in: path
                  required: true
                  description: "$1"
                  type: string`, [name, desc || 'Not provided']);

export const YMLPathsEntityBodyVarsTpl = (name: string, desc: string = '') => rep(`
                - name: body
                  description: "$1"
                  in: body
                  schema:
                    $ref: '#/definitions/$0'`, [name, desc || 'Not provided']);

export const YMLPathsEntityVerbRespTpl = (ref: string) => rep(`
                        $ref: '#/definitions/$0'`, [ref]);
export const YMLPathsEntityVerbArrayRespTpl = (ref: string) => rep(`
                        type: array
                        items:
                            $ref: '#/definitions/$0'`, [ref]);

export const YMLPathsTpl = (props: string) => rep(`
paths:
$0
`, [props]);

const YMLsecureTPL = () => `
            security:
              - bearerAuth: []`;
