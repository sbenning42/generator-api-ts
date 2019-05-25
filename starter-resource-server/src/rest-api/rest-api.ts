import { Application } from 'express';
import { SampleAPI } from './apis/sample-api';
import { Auth } from '../passport/auth';
import { AuthAPI } from './apis/auth-api';

export class RestAPI {

    constructor(
        public app: Application,
        public auth: Auth
    ) {
        new AuthAPI(app, auth);
        new SampleAPI(app, auth);
    }
}