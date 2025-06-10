const connectionService = require('./ConnectionsService');
const redisService = require('./RedisService'); 

class OnlineUserService {

    async onlineUserEventLoop()
    {
        setInterval(() => {
            this.broadcastOnlineFriends()
        }, 20000);
    }

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