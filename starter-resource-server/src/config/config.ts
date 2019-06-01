import { environment } from '../environment';
import { APISchemaConfig } from '../utils/api-gen/types';

const {
    JWT_SECRET,
    PATH_GENERATED,
    BACKUP_GENERATED,
} = environment;

export const config: APISchemaConfig = {
    auth: {
        secret: JWT_SECRET,
        defaultScopes: false
    },
    outDir: PATH_GENERATED,
    backupOutDir: BACKUP_GENERATED
};
