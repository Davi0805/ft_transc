const redisService = require('../../../Application/Services/RedisService');
const connectionsService = require('../../../Application/Services/ConnectionsService');
const chatMessageService = require('../../../Application/Services/ChatMessageService');

class WebSocketController {
    async helloWorld(socket, req) // the infamous hello world
    {
        /* console.log(req.headers); */

        const session = JSON.parse(await redisService.getSession(req.headers.authorization));
            if (!session)
                socket.close();
        await connectionsService.addUser(session.user_id, socket);


        socket.on('open', async () => {
        })

        socket.on('message', async message => {
            console.log('User '+ session.user_id + 'send message = '+String(message));
            const parsedMessage = JSON.parse(message);
            // TODO: CHECAR SE USER FAZ PARTE DE CONVERSATION ID
            await chatMessageService.saveMessage(parsedMessage.conversation_id, session.user_id, parsedMessage.message);
            
            //todo: PENSAR EM LOGICA OTIMIZADA PARA BROADCAST DE MENSAGENS
            //todo: POIS PRECISO DO ID DO USER QUE VAI RECEBER

            const receiverSocket = await connectionsService.getUser(String(parsedMessage.receiver_id));
            console.log('RECEIVER ID = '+parsedMessage.receiver_id + ' | socket = '+receiverSocket);
            if (receiverSocket)
                receiverSocket.send(JSON.stringify({conversation_id: parsedMessage.conversation_id, message: parsedMessage.message}));
        })

        socket.on('close', async () => {
            console.debug('Removing user from map');
            await connectionsService.deleteUser(session.user_id);
        })
    }
}

module.exports = new WebSocketController();