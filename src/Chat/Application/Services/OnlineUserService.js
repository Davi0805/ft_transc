const connectionService = require('./ConnectionsService');
const redisService = require('./RedisService'); 

class OnlineUserService {

    /* 
    *   @brief EventLoop to broadcast the onlineFriends every 30 seconds
    */
    async onlineUserEventLoop()
    {
        setInterval(() => {
            this.broadcastOnlineFriends()
        }, 30000);
    }


    /* 
    *   @brief Function that will get all user friends from redis,
    *    then check in WebSocket connections map to see if its
    *    connected and broadcast the online_friends of user
    *   @returns {"online_users":[3,4]} - user_id of online users
    */
    async broadcastOnlineFriends()
    {
        console.log('PROCURANDO AMIGOS...');
        const users = await connectionService.getAll();
        for (const [key, usr] of users) {
            const friends = await redisService.getCachedFriends(key);
            if (!friends) continue;
            const parsedFriends = JSON.parse(friends);
            const friendArr = Object.keys(parsedFriends);
            const onlineUsers = [];
            for (const friend of friendArr) {
                const temp = await connectionService.getUser(friend);
                if (temp) onlineUsers.push(parseInt(friend));
            }
            usr.send(JSON.stringify({ online_users: onlineUsers }));
        }
    }


}

module.exports = new OnlineUserService();