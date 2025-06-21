// Its like a input dto, but in fastify i need to use Scheme to fastify be able to optimize

class InputValidator {

    setup(fastify)
    {
        this.login(fastify);
        this.createUser(fastify);
        this.verifytwofa(fastify);
        this.updateName(fastify);
        this.updatePass(fastify);
        this.createFriendReq(fastify);
    }

    // !USER DTO VALIDATORS
    login(fastify)
    {
        fastify.addSchema({
        $id: 'login',
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: { type: 'string' },
            password: {type: 'string'}
        },
        additionalProperties: false
        });
    }

    createUser(fastify)
    {
        fastify.addSchema({
        $id: 'createUser',
        type: 'object',
        required: ['name', 'username', 'email', 'password_hash'],
        properties: {
            name: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            password_hash: {type: 'string'}
        },
        additionalProperties: false
        });
    }

    verifytwofa(fastify)
    {
        fastify.addSchema({
        $id: 'verifytwofa',
        type: 'object',
        required: ['token'],
        properties: {
            token: { type: 'string' }
        },
        additionalProperties: false
        });
    }

    updateName(fastify)
    {
        fastify.addSchema({
        $id: 'updateName',
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string' }
        },
        additionalProperties: false
        });
    }

    updatePass(fastify)
    {
        fastify.addSchema({
        $id: 'updatePass',
        type: 'object',
        required: ['old_password', 'password'],
        properties: {
            old_password: { type: 'string' },
            password: { type: 'string' }
        },
        additionalProperties: false
        });
    }

    createFriendReq(fastify)
    {
        fastify.addSchema({
        $id: 'createFriendReq',
        type: 'object',
        required: ['receiver_id'],
        properties: {
            receiver_id: { type: 'number' }
        },
        additionalProperties: false
        });
    }
}

module.exports = new InputValidator();