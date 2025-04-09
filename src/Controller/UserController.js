const userService = require('../Services/UserService');


// todo: learn how to check this fucking structured | no structured classes
class UserController {

    async getAll(req, reply)
    {
        const users = await userService.getAll();
        reply.send(users);
    }

    async getById(req, reply)
    {
        const user = await userService.findById(req.params.id);
        reply.send(user);
    }

    async createUser(req, reply) 
    {
        const user = req.body;
        const result = await userService.createUser(user);
        if (!result)
            return reply.code(400).send();
        return reply.code(201);
    }

    async Login(req, reply)
    {
        const user = req.body;
        const IsAuth = await userService.Login(user);
        if (!IsAuth)
            return reply.code(404).send();
        reply.send();
    }
}

module.exports = new UserController();