const userService = require('../../../Application/Services/UserService');
const jwtService = require('../../../Application/Services/JwtService');
const redisService = require('../../../Application/Services/RedisService');
const twofaService = require('../../../Application/Services/TwoFactorAuthService');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const exception = require('../../../Infrastructure/config/CustomException');

class UserController {


    /* 
    *    @brief Endpoint for debug purposes, thats why returns too many critical data
    *    GET - localhost:8080/users/{id}
    *    @returns list of users
    */
    async getAll(req, reply)
    {
        const users = await userService.getAll();
        return reply.send(users);
    }


    /* 
    *    @brief Endpoint to return a few personal data of user
    *    GET - localhost:8080/users/me
    *    @returns id and nickname
    */
    async getMyData(req, reply)
    {
        const users = await userService.findById(req.session.user_id);
        return reply.send({id: users[0].user_id, nickname: users[0].name});
    }



    /* 
    *    @brief Get by id endpoint
    *    GET - localhost:8080/users/{id}
    *    @params {id: (long)} - user_id that is being searched
    *    @returns list of users
    */
    async getById(req, reply)
    {
        const user = await userService.findById(req.params.id);
        return reply.send({ user_id: user[0].user_id,
                            name: user[0].name,
                            username: user[0].username,
                            email: user[0].email });
    }


    /* 
    *    @brief Get by username endpoint
    *    GET - localhost:8080/users/username/{username}
    *    @params {username: (string)} - username that is being searched
    *    @returns list of users
    */
    async getByUsername(req, reply)
    {
        const user = await userService.findByUsername(req.params.username);
        return reply.send(user);
    }


    /* 
    *    @brief Endpoint to create user
    *    POST - localhost:8080/users
    *    @params name: (string)
    *    @params username: (string)
    *    @params email: (string)
    *    @params password_hash: (string) - pass that will be converted to hash
    */
    async createUser(req, reply)
    {
        await userService.createUser(req.body); // bad pratice but i can make a dto later
        return reply.code(201).send();
    }


    /* 
    *    @brief Endpoint to upload user avatar as multipart/form-data
    *    POST - localhost:8080/users/upload-avatar
    *    @params avatar: (file) - file to be uploaded
    */
    async uploadAvatar(req, reply)
    {
        if (!req.file) throw exception('File not found!', 400);
        await userService.uploadAvatar(req.file.path, req.session.user_id);
        return reply.send();
    }


    /* 
    *    @brief Endpoint to update users name
    *    PUT - localhost:8080/users/name
    *    @params name: (string)
    */
    async updateName(req, reply)
    {
        await userService.updateName({name: req.body.name, id: req.session.user_id});
        return reply.send();
    }


    /* 
    *    @brief Endpoint to update users password
    *    PUT - localhost:8080/user/password
    *    @params name: (string)
    */
    async updatePassword(req, reply)
    {
        await userService.updatePassword({new_password: req.body.password,
                        old_password: req.body.old_password, id: req.session.user_id});
        return reply.send();
    }


    /* 
    *    @brief Endpoint to be able to get the static avatar picture from the server
    *    GET - localhost:8080/users/avatar/{id}
    *    @params {id: (long)} - user_id that is being searched
    *    @returns {file: (file)} - base64
    */
    async getAvatar(req, reply)
    {
        const user = await userService.findById(req.params.id);
        const imagePath = user[0].user_image;
        if (!imagePath) throw exception('Image not defined!', 204);
        const mimeType = mime.lookup(imagePath);
        if (!mimeType) throw exception("Unsupported mime type", 415);

        const stream = fs.createReadStream(imagePath);
        return reply.type(mimeType).send(stream);
    }


    /* 
    *    @brief Login endpoint to authenticate users and cache friendships on redis
    *    POST - localhost:8080/login
    *    @params {username: (string), password: (string)}
    *    @returns {token: (string)} - returns the jwt token of user
    *    @returns {verified: (boolean)} - returns if user is fully authenticated (true)
    *    or still need  to make 2FA auth (false)
    */
    async Login(req, reply)
    {
        const { user_id, twofa_secret } = await userService.Login(req.body);
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
    *    @brief Endpoint to activate 2FA to user account and generate qrcode
    *    POST - localhost:8080/twofa/activate
    *    @returns QRCODE - to be used on google authenticator
    */
    async activateTwoFactorAuth(req, reply)
    {
        const user = await userService.findById(req.session.user_id);
        if (user.twofa_enabled) throw exception('2FA already activated', 400);
        const twofa = await twofaService.generateSecret();
        await userService.activateTwoFactorAuth(req.session.user_id, twofa.secret);
        return reply.send({qrcode: twofa.qrCodeUrl});
    }


    /* 
    *    @brief Endpoint to verify the 2FA TOKEN, after login if the user is not verified
    *    will be necessary send the token from google authenticator or other to check-in
    *    POST - localhost:8080/twofa/auth
    *    @params token: (string) - temporary token from 2FA app, like google authenticator
    */
    async twofa_verify(req, reply)
    {
        const user = await userService.findById(req.session.user_id);
        await twofaService.verifyToken(user[0].twofa_secret, req.body.token)
        const jwt = req.headers.authorization.substring(7);
        await redisService.saveSession(jwt, { user_id: req.session.user_id, twofa_verified: 1 });
        return reply.send();
    }
}

module.exports = new UserController();