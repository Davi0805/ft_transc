const usrCustomsController = require('../../Adapters/inbound/UserCustomsController');

async function usrCustomsRoutes(fastify, options) {
    fastify.get('/usercustoms/:id', usrCustomsController.getUserById);
    fastify.put('/usercustoms/:id', usrCustomsController.updateUserCustoms);
    fastify.post('/usercustoms/:id', usrCustomsController.createDefault); // debug
}

module.exports = usrCustomsRoutes;