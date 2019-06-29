

export const DefaultTodoProjectionObject = {
    title: 1,
    done: 1,
    json: 1,
    author: 1,
};


export const DefaultTodoPopulateObject = {
    author: true,
};


export class $name {

    model = $modelName;

    constructor() {
    }

    find(
        mongooseQueryObject: $queryObject,
        mongooseProjectionObject: $projectionObject,
        mongoosePopulateObject: $populateObject,
        mongooseQueryOptions: any,
    ) {
        return this.model.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions
        );
    }

    create(
        createPayload: $createPayloadModel,
        mongooseProjectionObject: $projectionObject,
        mongoosePopulateObject: $populateObject,
    ) {

    }

    update() {
    }

    delete() {
    }

    findLean() {
        return this.find().lean();
    }

    createLean() {
        return this.create().lean();
    }

    updateLean() {
        return this.update().lean();
    }

    deleteLean() {
        return this.delete().lean();
    }

    findExec() {
        return this.find().exec();
    }

    createExec() {
        return this.create().exec();
    }

    updateExec() {
        return this.update().exec();
    }

    deleteExec() {
        return this.delete().exec();
    }

    findLeanExec() {
        return this.findLean().exec();
    }

    createLeanExec() {
        return this.createLean().exec();
    }

    updateLeanExec() {
        return this.updateLean().exec();
    }

    deleteLeanExec() {
        return this.deleteLean().exec();
    }
}










