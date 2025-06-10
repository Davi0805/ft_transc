const redisService = require('../../../Application/Services/RedisService');
const connectionsService = require('../../../Application/Services/ConnectionsService');
const chatMessageService = require('../../../Application/Services/ChatMessageService');
const ConversationService = require('../../../Application/Services/ConversationsService');
class WebSocketController {
    async helloWorld(socket, req) // the infamous hello world
    {
        /* console.log(req.headers); */

        // console.log("RONALDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOooo");
        // const session = JSON.parse(await redisService.getSession(req.headers.authorization));
        // if (!session) {
        //     console.log("OOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOo");
        //     socket.close();
        // }
        // else {
        //     console.log('BORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAABORAAAAAA')
        // }

        // Extract token from subprotocol
        let token = null;
        const protocols = req.headers['sec-websocket-protocol'];
        if (protocols) {
            // protocols is a comma-separated string
            const protocolArr = protocols.split(',').map(p => p.trim());
            const bearerProtocol = protocolArr.find(p => p.startsWith('Bearer.'));
            if (bearerProtocol) {
                token = bearerProtocol.split('Bearer.')[1];
            }
        }
        if (!token) {
            socket.close();
            return;
        }
        const session = JSON.parse(await redisService.getSession('Bearer ' + token));
        if (!session) {
            socket.close();
            return;
        }
        await connectionsService.addUser(session.user_id, socket);


        socket.on('open', async () => {
        })

        socket.on('message', async message => {
            console.log('User ' + session.user_id + ' send message = ' + String(message));
            const parsedMessage = JSON.parse(message);
            const conversation_data = await ConversationService
                .getConversationById(parsedMessage.conversation_id);

            if (session.user_id != conversation_data[0].user1 && session.user_id != conversation_data[0].user2)
                return;

            const receiver_id = conversation_data[0].user1 != session.user_id ? conversation_data[0].user1 : conversation_data[0].user2;

            await chatMessageService.saveMessage(parsedMessage.conversation_id, session.user_id, parsedMessage.message);

            //todo: PENSAR EM LOGICA OTIMIZADA PARA BROADCAST DE MENSAGENS
            //todo: POIS PRECISO DO ID DO USER QUE VAI RECEBER

            const receiverSocket = await connectionsService.getUser(String(receiver_id));
            console.log('RECEIVER ID = ' + receiver_id + ' | socket = ' + receiverSocket);
            if (receiverSocket)
                receiverSocket.send(JSON.stringify({ conversation_id: parsedMessage.conversation_id, message: parsedMessage.message }));
        })

        socket.on('close', async () => {
            console.debug('Removing user from map');
            console.log("OOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOoOOoOOOOOOOOOOOOOOo");

            await connectionsService.deleteUser(session.user_id);
        })
    }
}

module.exports = new WebSocketController();