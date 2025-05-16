const userController = require('../../Adapters/inbound/http/UserController');

async function userRoutes(fastify, options) {
    fastify.get('/users', userController.getAll);
    fastify.get('/users/:id', userController.getById);
    fastify.post('/users', userController.createUser);
    fastify.post('/login', userController.Login);
    fastify.post('/twofa/activate', userController.activateTwoFactorAuth);
    fastify.post('/twofa/auth', userController.twofa_verify);
}

module.exports = userRoutes;