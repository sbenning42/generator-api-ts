import dotenv from 'dotenv';
dotenv.config();

import { generateAll } from './utils/api-generator';
import { models } from './models';

const { PATH_GENERATED, BACKUP_GENERATED } = process.env;

generateAll(models, PATH_GENERATED, BACKUP_GENERATED === 'true');
