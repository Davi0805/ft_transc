const userService = require('../Services/UserService');

class UserController {

    async getAll(req, reply)
    {
        const users = await userService.getAll();
        reply.send(users);
    }
}

module.exports = new UserController();