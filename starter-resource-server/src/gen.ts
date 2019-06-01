import { APIGen } from './common/api-gen/core';
import { schema } from './config';

const EXIT = (status: number) => process.exit(status), FAILURE = 1, SUCCESS = 0;

function succeed() {
    const G = new APIGen();
    const { outDir, backupOutDir } = schema.config;
    if (!!backupOutDir) {
        G.backup(outDir, backupOutDir);
    }
    G.write(outDir, G.generate(schema));
    
    EXIT(SUCCESS);
}

function failed(error: any) {
    console.error(error);
    
    EXIT(FAILURE);
}

function main() {
    try { succeed() }
    catch(e) { failed(e) }
}

main();
