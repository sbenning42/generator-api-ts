import { Application } from "express";
import { prettifyRouter } from "./prettier";
import { UserRouter } from "../../gen-apis/user/user";
import { CredentialRouter } from "../../gen-apis/credential/credential";

export function testLogGeneratedRouters(app: Application) {
    const ctx = {
        logToken: () => {}
    };
    const credential = new CredentialRouter(ctx);
    credential.applyRouter(app);

    const user = new UserRouter(ctx);
    user.applyRouter(app);

    prettifyRouter('credentials', credential.router, console);
    prettifyRouter('users', user.router, console);
}
