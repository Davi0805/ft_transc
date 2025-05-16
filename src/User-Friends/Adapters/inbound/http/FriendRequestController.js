const friendRequest = require('../../../Application/Services/FriendRequestService');

const redisService = require('../../../Application/Services/RedisService');

class FriendRequestController {

    /* 
        Endpoint for debug purposes
        GET - localhost:8080/friend_requests
    */
    async getAll(req, reply)
    {
        try {
            const requests = await friendRequest.findAll();
            return reply.send(requests);   
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }


    /* 
        Endpoint to create/start/request a new friendship
        POST - localhost:8080/friend_requests
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params {sender_id: (Long), receiver_id: (Long)}
    */
    async create(req, reply)
    {
        try {
            const session = await redisService.validateSession((req.headers.authorization));
            if (session.user_id != req.body.sender_id) throw 401;
            await friendRequest.newRequest(req.body.sender_id, req.body.receiver_id);
            return reply.send();    
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
        
    }

    /* 
        Endpoint to list all friend requests pending that u can accept
        GET - localhost:8080/friend_requests/pending
        @params {HTTP Header} Authorization: Bearer <JWT> 
    */
    async listPendingRequests(req, reply) {
        try {
            const session = await redisService.validateSession((req.headers.authorization));
            const pendingRequests = await friendRequest.listPendingRequests(session.user_id);
            return reply.send(pendingRequests);   
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }

    /* 
        Endpoint to accept the friendship requests that u received
        POST - localhost:8080/friend_requests/{request_id}/accept
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params request_id: (Long) - id of friend_request
    */
    async acceptRequest(req, reply) {
        try {
            const request_id = req.params.id;
            const session = await redisService.validateSession((req.headers.authorization));
            // todo: make a query that change and return the row 
            await friendRequest.acceptRequest(request_id, session.user_id);
            await redisService.postMessage('newFriendshipEvent', {user1: 13, user2: 14}); //debug
    
            return reply.send();    
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
        
    }
    /* 
        Endpoint to reject the friendship requests that u received
        POST - localhost:8080/friend_requests/{request_id}/reject
        @params {HTTP Header} Authorization: Bearer <JWT> 
        @params request_id: (Long) - id of friend_request
    */
    async rejectRequest(req, reply) {
        try {
            const request_id = req.params.id;
            const session = await redisService.validateSession((req.headers.authorization));
            await friendRequest.rejectRequest(request_id, session.user_id);
            return reply.send();   
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }
    /*
        Endpoint to retrieve all friends of user, based on friend requests table
        @params {HTTP Header} Authorization: Bearer <JWT> 
        GET -  localhost:8080/friends
    */
    async getAllFriends(req, reply) {
        try {
            const session = await redisService.validateSession((req.headers.authorization));
            // implement caching logic in getAllFriends
            const friends = await friendRequest.getAllFriends(session.user_id);
            return reply.send(friends);   
        } catch (error) {
            if (typeof error === 'number')
                return reply.code(error).send();

            return reply.code(400).send();
        }
    }
}

module.exports = new FriendRequestController();