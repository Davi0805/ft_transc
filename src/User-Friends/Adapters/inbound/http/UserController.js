const userService = require('../../../Application/Services/UserService');
const jwtService = require('../../../Application/Services/JwtService');
const redisService = require('../../../Application/Services/RedisService');
const twofaService = require('../../../Application/Services/TwoFactorAuthService');

class UserController {


    /* 
        Endpoint for debug purposes, thats why returns too many critical data
        GET - localhost:8080/users/{id}
        @params {HTTP Header} Authorization: Bearer <JWT>
        @returns list of users
    */
    async getAll(req, reply) {
        try {
            const session = await redisService.validateSession((req.headers.authorization));
            const users = await userService.getAll();
            if (!users || Object.keys(users).length === 0) throw 404;
            return reply.send(users);
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }


    /* 
        Get by id endpoint
        GET - localhost:8080/users/{id}
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params {id: (long)} - user_id that is being searched
        @returns list of users
    */
    async getById(req, reply) {
        try {
            const session = await redisService.validateSession((req.headers.authorization));
            const user = await userService.findById(req.params.id);
            if (!user || Object.keys(user).length === 0) throw 404;
            return reply.send(user);
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }


    /* 
        Endpoint to create user
        POST - localhost:8080/users
        @params name: (string)
        @params username: (string)
        @params email: (string)
        @params password_hash: (string) - pass that will be converted to hash
        */
    async createUser(req, reply) {
        try {
            const user = req.body;
            const result = await userService.createUser(user);
            if (!result) throw 400;
            return reply.code(201).send();
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }


    /* 
        Login endpoint to authenticate users and cache friendships on redis
        POST - localhost:8080/login
        @params {username: (string), password: (string)}
        @returns {token: (string)} - returns the jwt token of user
        @returns {verified: (boolean)} - returns if user is fully authenticated (true)
        or still need  to make 2FA auth (false)
    */
    async Login(req, reply) {
        try {
            const user = req.body;
            const { user_id, twofa_secret } = await userService.Login(user);
            const token = await jwtService.generate(user_id);
            await redisService.postMessage('cacheFriends', JSON.stringify({ user_id: user_id }));
            if (twofa_secret) // if the user have 2FA activated
            {
                await redisService.saveSession(token, { user_id: user_id, twofa_verified: 0 });
                return reply.send({ token: token, verified: false });
            }
            await redisService.saveSession(token, { user_id: user_id, twofa_verified: 1 });
            return reply.send({ token: token, verified: true });
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }

    /* 
        Endpoint to activate 2FA to user account and generate qrcode
        POST - localhost:8080/twofa/activate
        @params {HTTP Header} Authorization: Bearer <JWT> 
    */
    async activateTwoFactorAuth(req, reply) {
        try {
            const session = await redisService.validateSession((req.headers.authorization));
            // todo: optimize the query later
            const user = await userService.findById(session.user_id);
            if (user.twofa_enabled) throw 400;
            const twofa = await twofaService.generateSecret();
            await userService.activateTwoFactorAuth(session.user_id, twofa.secret);
            return reply.send(twofa.qrCodeUrl);
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }

    /* 
        Endpoint to verify the 2FA TOKEN, after login if the user is not verified
        will be necessary send the token from google authenticator or other to check-in
        POST - localhost:8080/twofa/auth
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params token: (string) - temporary token from 2FA app, like google authenticator
    */
    async twofa_verify(req, reply) {
        try {
            const body = req.body;
            const session = JSON.parse(await redisService.getSession((req.headers.authorization)));
            const user = await userService.findById(session.user_id);
            if (!await twofaService.verifyToken(user[0].twofa_secret, body.token)) throw 401;
            const jwt = req.headers.authorization.substring(7);
            await redisService.saveSession(jwt, { user_id: session.user_id, twofa_verified: 1 });
            return reply.send();
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }
}

module.exports = new UserController();