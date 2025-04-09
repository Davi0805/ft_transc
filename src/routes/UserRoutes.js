const userController = require('../Controller/UserController');

async function userRoutes(fastify, options) {
    fastify.get('/users', userController.getAll);
}

module.exports = userRoutes;