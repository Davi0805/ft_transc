const userController = require('../../Adapters/inbound/http/UserController');

async function userRoutes(fastify, options) {
    fastify.get('/users', userController.getAll);
    fastify.get('/users/:id', userController.getById);
    fastify.post('/users', userController.createUser);
    fastify.post('/login', userController.Login);
    fastify.post('/twofa/activate', userController.activateTwoFactorAuth);
    fastify.post('/twofa/auth', userController.twofa_verify);
    fastify.post('/users/upload-avatar', {
        preHandler: fastify.blob.single('avatar'),
        handler: userController.uploadAvatar
      });
    fastify.get('/users/avatar/:id', userController.getAvatar);
    fastify.get('/users/me', userController.getMyData);
    fastify.put('/users/name', userController.updateName);
    fastify.put('/user/password', userController.updatePassword);
}

module.exports = userRoutes;