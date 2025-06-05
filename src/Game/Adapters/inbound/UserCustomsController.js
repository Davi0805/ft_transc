const usrCustomsService = require('../../Application/Services/UserCustoms');

class UserCustomsController {
    async getUserById(req, reply)
    {
        try {
            const data = await usrCustomsService.getUserById(req.params.id);
            return reply.send(data);
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }

    // debug
    async createDefault(req, reply)
    {
        try {
            const data = await usrCustomsService.createDefault(req.params.id);
            return reply.send();
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }

    async updateUserCustoms(req, reply)
    {
        try {
            const paddle = req.body.paddle_sprite;
            // todo: replace by session id when add the authentication
            const data = await usrCustomsService.updateUserCustoms(paddle, req.params.id);
            return reply.send();
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();
            console.log(error);
            return reply.code(400).send();
        }
    }
}

module.exports = new UserCustomsController();