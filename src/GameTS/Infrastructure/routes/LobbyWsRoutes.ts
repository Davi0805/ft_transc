import type { FastifyInstance, FastifyPluginOptions } from "fastify";

import lobbyWsGateway from "../../Adapters/Inbound/LobbyWsGateway.js";

export async function LobbyWsGatewayRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.get<{ Params: { lobbyID: string } }>(
        '/ws/:lobbyID', {websocket: true}, lobbyWsGateway.join);
}