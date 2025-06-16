const redisService = require('../../../Application/Services/RedisService');
const connectionsService = require('../../../Application/Services/ConnectionsService');
const chatMessageService = require('../../../Application/Services/ChatMessageService');
const ConversationService = require('../../../Application/Services/ConversationsService');
class WebSocketController {
    async chat(socket, req) // the infamous hello world
    {

        const session = await redisService.validateSession(req.headers.authorization);
            if (!session)
                socket.close();
        await connectionsService.addUser(session.user_id, socket);


        socket.on('open', async () => {
        })

        socket.on('message', async message => {
            /* console.log('User '+ session.user_id + ' send message = '+String(message)); */
            const parsedMessage = JSON.parse(message);
            const conversation_data = await ConversationService
                                        .getConversationById(parsedMessage.conversation_id);

            if (session.user_id != conversation_data[0].user1 && session.user_id != conversation_data[0].user2)
                return ;

            const receiver_id = conversation_data[0].user1 != session.user_id ? conversation_data[0].user1 : conversation_data[0].user2;                            
            await chatMessageService.saveMessage(parsedMessage.conversation_id, session.user_id, parsedMessage.message);
            
            //todo: PENSAR EM LOGICA OTIMIZADA PARA BROADCAST DE MENSAGENS
            //todo: POIS PRECISO DO ID DO USER QUE VAI RECEBER
            const receiverSocket = await connectionsService.getUser(String(receiver_id));
            /* console.log('RECEIVER ID = '+receiver_id + ' | socket = '+receiverSocket); */
            if (receiverSocket)
                receiverSocket.send(JSON.stringify({conversation_id: parsedMessage.conversation_id, message: parsedMessage.message}));
        })

        socket.on('close', async () => {
            /* console.debug('Removing user from map'); */
            await connectionsService.deleteUser(session.user_id);
        })
    }
}

module.exports = new WebSocketController();