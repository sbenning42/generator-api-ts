## TODO -- apply those to `ApIGen` (it replace old implementation (RIP) `APIGenerator`)

# 1 - P0! - Change type for relation value in schema `relations`

it should accept `string | CRUDSchemaInputPropTyped` as type not just `string`
`api-generator/[templates.ts@templates, core.ts@APIGenerator.generate]`

# 2 - P3 - Add middlewares for `Lean` and default version of queries

aka: not just `LeanExec` ones
`api-generator/templates.ts@templates`

# 3 - P3 - Add synchronous middlewares ()

populate `req['CTX']` with `Promise` (aka: not results) for performances

# 4 - P1! - Add synchronous middlewares with factories

populate `req['CTX']` with `() => Promise` (aka: not results) for lazyness

# 5 - P5 - Add some default `passport` middlewares support

`api-generator/[templates.ts@templates, core.ts@APIGenerator.generate]`
