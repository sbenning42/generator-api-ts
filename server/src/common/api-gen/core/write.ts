import fs from 'fs';
import { ctx as getCtx } from "./ctx";

export function write() {
    const ctx = getCtx();
    const generated = ctx.generated;
    const { outDir } = ctx.schema.config || { outDir: './src/generated-code' };
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { mode: 0o755 });
    }
    const swaggerPreffix = generated.swagger.preffix;
    const swaggerPaths = generated.swagger.paths;
    const swaggerDefinition = generated.swagger.definitions;
    fs.writeFileSync(`${outDir}/schema.yml`, [
        swaggerPreffix,
        swaggerDefinition,
        swaggerPaths
    ].join('\n'), { mode: 0o644, flag: 'w' });
    const tsTypes = Object.entries(generated.typescript).reduce((all, [apiName, apiGen]: [string, any]) => {
        const tsApi = [
            generated.imports.api,
            apiGen.api.utils,
            apiGen.api.service,
            apiGen.api.controller,
            apiGen.api.router,
        ].join('\n');
        if (!fs.existsSync(`${outDir}/${apiName}`)) {
            fs.mkdirSync(`${outDir}/${apiName}`, { mode: 0o755 });
        }
        fs.writeFileSync(`${outDir}/${apiName}/${apiName}.ts`, tsApi, { mode: 0o644, flag: 'w' });
        return [
            all,
            apiGen.types.model,
            apiGen.types.populatedModel,
            apiGen.types.createModel,
            apiGen.types.setModel,
            apiGen.types.pushModel,
            apiGen.types.pullModel,
            apiGen.types.updateModel,
        ].join('\n');
    }, generated.imports.types);
    fs.writeFileSync(`${outDir}/types.ts`, tsTypes, { mode: 0o644, flag: 'w' });
}
