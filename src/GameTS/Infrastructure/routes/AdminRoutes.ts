import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify"
import authMiddleware from "../config/AuthMiddleware.js";
import adminController from "../../Adapters/Inbound/AdminController.js";
import CustomException from "../config/customException.js";


async function adminAuth(req: FastifyRequest, reply: FastifyReply)
{
    if (!req.session.username || req.session.username !== "admin") {
        console.log(req.session.username);
        throw CustomException("You are not authorized to view this page!", 401);
    }
}

export async function adminRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.post('/removeRepos', {
        preHandler: [authMiddleware, adminAuth],
        handler: adminController.deleteAllRepos
    });
}