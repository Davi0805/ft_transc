import type { FastifyRequest, FastifyReply } from "fastify";
import CustomException from "./customException.js";
import redisService from "../../Application/Services/RedisService.js";

export default async function authMiddleware(req: FastifyRequest, reply: FastifyReply)
{
        const authHeader = req.headers.authorization;
        if (!authHeader) throw CustomException('Authorization header not found!', 401);
        const metadata = await redisService.validateSession(authHeader);
        req.session = metadata;
}