const userController = require('../Controller/UserController');

async function userRoutes(fastify, options) {
    fastify.get('/users', userController.getAll);
    fastify.get('/users/:id', userController.getById);
    fastify.post('/users', userController.createUser);
    fastify.post('/login', userController.Login);
}

module.exports = userRoutes;