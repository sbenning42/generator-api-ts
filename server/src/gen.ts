import { prepareUser } from './common/api-gen/core/prepare-user';
prepareUser();
import { computeCtx, write } from './common/api-gen';
import { apis } from './apis';

const EXIT = (status: number) => process.exit(status), FAILURE = 1, SUCCESS = 0;

function succeed() {
    computeCtx({ apis }, true);
    write();
    
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
