const matchController = require('../../Adapters/inbound/MatchController');

async function matchRoutes(fastify, options) {
    fastify.get('/match', matchController.getAll);
    fastify.get('/match/:id', matchController.getById);
    fastify.post('/match', matchController.saveMatch);
    fastify.post('/match/players', matchController.savePlayers);
}

module.exports = matchRoutes;