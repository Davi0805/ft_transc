const redis = require('../../../Infrastructure/config/RedisPubSub');
const connectedUsersService = require('../../../Application/Services/ConnectionsService');
const conversationService = require('../../../Application/Services/ConversationsService');
const messageService = require('../../../Application/Services/ChatMessageService');

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

    async handleLobbyInvitations(message)
    {
        let parsedMsg;
        try {
            parsedMsg = JSON.parse(message);
        } catch (error) {
            console.log('GAVE SHIT');            
        }
        const conversation = await conversationService.getConversationByUserIds(parsedMsg.from_user, parsedMsg.to_user);
        const socket = await connectedUsersService.getUser(parsedMsg.to_user);
        await messageService.saveInviteMessage(conversation[0].id, parsedMsg.from_user, parsedMsg.lobbyId);
        console.log(message);
        if (!socket) return;
        socket.send(JSON.stringify({ conversation_id: conversation[0].id,
                         message: 'match_invite', metadata: parsedMsg.lobbyId }));
    }
}

module.exports = new EventBroadcast();