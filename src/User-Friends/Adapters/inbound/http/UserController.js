const userService = require('../../../Application/Services/UserService');
const jwtService = require('../../../Application/Services/JwtService');
const redisService = require('../../../Application/Services/RedisService');
const twofaService = require('../../../Application/Services/TwoFactorAuthService');
const fs = require('fs');
const path = require('path');
const exception = require('../../../Infrastructure/config/CustomException');

class UserController {

    /* 
        Endpoint for debug purposes, thats why returns too many critical data
        GET - localhost:8080/users/{id}
        @params {HTTP Header} Authorization: Bearer <JWT>
        @returns list of users
    */
    async getAll(req, reply)
    {
        const users = await userService.getAll();
        return reply.send(users);
    }

    async getMyData(req, reply)
    {
        const users = await userService.findById(req.session.user_id);
        return reply.send({id: users[0].user_id, nickname: users[0].name});
    }

    /* 
        Get by id endpoint
        GET - localhost:8080/users/{id}
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params {id: (long)} - user_id that is being searched
        @returns list of users
    */
    async getById(req, reply) {
        const user = await userService.findById(req.params.id);
        return reply.send(user);
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
        const result = await userService.createUser(req.body); // bad pratice but i can make a dto later
        if (!result) throw exception('Failed to create user!', 400);
        return reply.code(201).send();
    }


    // todo: safer way to upload files, cause it saves the file
    // todo: in the server, even if the user is not authenticated
    // todo: or the request fails
    /* 
        Endpoint to upload user avatar as multipart/form-data
        POST - localhost:8080/users/upload-avatar
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params avatar: (file) - file to be uploaded
    */
    async uploadAvatar(req, reply)
    {
        const file = req.file;
        if (!file) throw exception('File not found!', 400);
        await userService.uploadAvatar(file.path, req.session.user_id);
        return reply.send();
    }

    async updateName(req, reply)
    {
        const body = req.body;
        await userService.updateName({name: body.name, id: req.session.user_id});
        return reply.send();
    }

    async updatePassword(req, reply)
    {
        const body = req.body;
        await userService.updatePassword({new_password: body.password, old_password: body.old_password, id: req.session.user_id});
        return reply.send();
    }

    /* 
        Endpoint to be able to get the static avatar picture from the server
        GET - localhost:8080/users/avatar/{id}
        @params {HTTP Header} Authorization
        @params {id: (long)} - user_id that is being searched
        @returns {file: (file)} - file to be downloaded
    */
    // todo: I will let this here for now, but in the future
    // todo: when the frontend is ready, i finish this to be more accurate
    async getAvatar(req, reply) {
        const user = await userService.findById(req.params.id);
        if (!user || Object.keys(user).length === 0) throw exception('User not found!', 404);
        const imagePath = user[0].user_image;
        if (!imagePath) throw exception('Image not defined!', 204);
        const stream = fs.createReadStream(imagePath);
        return reply.type('image').send(stream);
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
    }

    /* 
        Endpoint to activate 2FA to user account and generate qrcode
        POST - localhost:8080/twofa/activate
        @params {HTTP Header} Authorization: Bearer <JWT> 
    */
    async activateTwoFactorAuth(req, reply) {
        // todo: optimize the query later
        const user = await userService.findById(req.session.user_id);
        if (user.twofa_enabled) throw exception('2FA already activated', 400);
        const twofa = await twofaService.generateSecret();
        await userService.activateTwoFactorAuth(req.session.user_id, twofa.secret);
        return reply.send({qrcode: twofa.qrCodeUrl});
    }

    /* 
        Endpoint to verify the 2FA TOKEN, after login if the user is not verified
        will be necessary send the token from google authenticator or other to check-in
        POST - localhost:8080/twofa/auth
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params token: (string) - temporary token from 2FA app, like google authenticator
    */
    async twofa_verify(req, reply) {
        const body = req.body;
        const user = await userService.findById(req.session.user_id);
        if (!await twofaService.verifyToken(user[0].twofa_secret, body.token)) throw exception('Wrong 2FA token!', 401);
        const jwt = req.headers.authorization.substring(7);
        await redisService.saveSession(jwt, { user_id: req.session.user_id, twofa_verified: 1 });
        return reply.send();
    }
}

module.exports = new UserController();