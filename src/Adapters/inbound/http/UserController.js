const userService = require('../../../Application/Services/UserService');
const jwtService = require('../../../Application/Services/JwtService');
const redisService = require('../../../Application/Services/RedisService');


class UserController {

    async getAll(req, reply)
    {
        const session = await redisService.getSession((req.headers.authorization));
        console.log("SESSION: " + session);
        if (!session)
            return reply.code(400).send();
        const users = await userService.getAll();
        reply.send(users);
    }

    async getById(req, reply)
    {
        const session = await redisService.getSession((req.headers.authorization));
        console.log("SESSION: " + session);
        if (!session)
            return reply.code(400).send();
        const user = await userService.findById(req.params.id);
        return reply.send(user);
    }

    async createUser(req, reply) 
    {
        const user = req.body;
        const result = await userService.createUser(user);
        if (!result)
            return reply.code(400).send();
        return reply.code(201).send();
    }

    async Login(req, reply)
    {
        const user = req.body;
        const user_id = await userService.Login(user);
        if (!user_id)
            return reply.code(404).send();

        const token = await jwtService.generate(user_id);
        await redisService.saveSession(token, {user_id: user_id});
        return reply.send({token: token});
    }
}

module.exports = new UserController();