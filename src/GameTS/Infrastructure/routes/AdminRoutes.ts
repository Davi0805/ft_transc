import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import authMiddleware from "../config/AuthMiddleware.js";
import adminController from "../../Adapters/Inbound/AdminController.js";


export async function adminRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.post('/removeRepos', {
        //preHandler: authMiddleware, TODO how the fuck do I add this in? Must I place this route in the frontend??
        handler: adminController.deleteAllRepos
    });
}