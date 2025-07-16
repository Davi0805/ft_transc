const userController = require('../../Adapters/inbound/http/UserController');
const authMiddleware = require('../config/AuthMiddleware');

async function userRoutes(fastify, options) {
    fastify.get('/users', {
      preHandler: authMiddleware,
      handler: userController.getAll
    });

    fastify.get('/users/:id', {
      handler: userController.getById
    });


    fastify.post('/users', {
      schema: {
        body: { $ref: 'createUser#' }
      }
    } ,userController.createUser);
    
    fastify.post('/login', {
      schema: {
        body: { $ref: 'login#' }
      }
    } ,userController.Login);
    
    fastify.post('/twofa/activate', {
      preHandler: authMiddleware,
      handler: userController.activateTwoFactorAuth
    });

    fastify.post('/twofa/activate/confirm', {
      preHandler: authMiddleware,
      handler: userController.confirmTwoFactorAuthActivation
    });
    
    fastify.get('/users/username/:username', {
      handler: userController.getByUsername
    });
    
    fastify.post('/twofa/auth', {
      schema: {
        body: { $ref: 'verifytwofa#' }
      },
      preHandler: authMiddleware,
      handler: userController.twofa_verify
    });
    
    fastify.post('/users/upload-avatar', {
        preHandler: [authMiddleware, fastify.blob.single('avatar')],
        handler: userController.uploadAvatar
      });
    
    fastify.get('/users/avatar/:id', userController.getAvatar);
    
    fastify.get('/users/me', {
      preHandler: authMiddleware,
      handler: userController.getMyData
    });
    
    fastify.put('/users/name', {
      schema: {
        body: { $ref: 'updateName#' }
      },
      preHandler: authMiddleware,
      handler: userController.updateName
    });
    
    fastify.put('/user/password', {
      schema: {
        body: { $ref: 'updatePass#' }
      },
      preHandler: authMiddleware,
      handler: userController.updatePassword
    });
}

module.exports = userRoutes;