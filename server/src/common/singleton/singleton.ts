export abstract class Singleton<What extends { __singleton: any } = any> {
    constructor(what: What) {
        if (what.__singleton !== undefined) {
            throw new Error(`Singleton: Cannot instanciate ${what.constructor.name} more than once.`);
        }
        what.__singleton = this;
    }
}
