import { APISchema } from "../utils/api-gen/types";
import { config } from "./config";
import { entities } from "./entities";

export const schema: APISchema = {
    entities,
    config,
    context: { name: 'context', from: '../config/context' }
};
