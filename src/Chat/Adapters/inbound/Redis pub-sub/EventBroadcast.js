const redis = require('../../../Infrastructure/config/RedisPubSub');
const connectedUsersService = require('../../../Application/Services/ConnectionsService');


class EventBroadcast {

    async subscribe(topic, callback)
    {
        redis.subscribe(topic, (message, topic) => {
            console.log('MESSAGE = '+message);
            console.log('TOPIC = '+topic);
            
            callback(message);
        });
    }

    async publish(topic, value)
    {
        return redis.publish(topic, JSON.stringify(value));
    }

    /* 
    *   @brief handle Real Time Notification and broadcast event via 
    *   websocket
    *   @params user_id: {int} - user_id to be notificated 
    *   @params event: {string} - type of event that will trigger an action
    *   on frontend
    */
    async handleRealTimeNotif(message)
    {
        let parsedMsg;
        try {
            parsedMsg = JSON.parse(message);
        } catch (error) {
            console.log('GAVE SHIT');            
        }
        const socket = await connectedUsersService.getUser(parsedMsg.user_id);
        console.log(message);
        if (!socket) return;
        socket.send(JSON.stringify({event: parsedMsg.event}));
    }
}

module.exports = new EventBroadcast();