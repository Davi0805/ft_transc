const redisService = require('../../../Application/Services/RedisService');
const connectionsService = require('../../../Application/Services/ConnectionsService');
const chatMessageService = require('../../../Application/Services/ChatMessageService');
const ConversationService = require('../../../Application/Services/ConversationsService');
class WebSocketController {
    async chat(socket, req) // the infamous hello world
    {

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
        //const session = await redisService.validateSession(req.headers.authorization);
        //    if (!session)
        //        socket.close();
        //TODO: FIX KEY OF MAP AS STRING - NEED TO CHANGE TO INT
        await connectionsService.addUser(session.user_id, socket);

        const friends = await redisService.getCachedFriends(session.user_id);
        if (friends) {
            const parsedFriends = JSON.parse(friends);
            const friendArr = Object.keys(parsedFriends);
            const onlineUsers = [];
            for (const friend of friendArr) {
                const temp = await connectionsService.getUser(friend);
                if (temp) onlineUsers.push(parseInt(friend));
            }
            socket.send(JSON.stringify({ online_users: onlineUsers }));
        }

        socket.on('open', async () => {
        })

        socket.on('message', async message => {
            const parsedMessage = JSON.parse(message);
            const conversation_data = await ConversationService
                .getConversationById(parsedMessage.conversation_id);

            if (session.user_id != conversation_data[0].user1 && session.user_id != conversation_data[0].user2)
                return;

            if (parsedMessage.type === 'read_event')
            {
                chatMessageService.setMessagesRead(parsedMessage.conversation_id, session.user_id);
                return ;
            }

            const receiver_id = conversation_data[0].user1 != session.user_id ? conversation_data[0].user1 : conversation_data[0].user2;


            await chatMessageService.saveMessage(parsedMessage.conversation_id, session.user_id, parsedMessage.message);

            //todo: PENSAR EM LOGICA OTIMIZADA PARA BROADCAST DE MENSAGENS
            //todo: POIS PRECISO DO ID DO USER QUE VAI RECEBER
            const receiverSocket = await connectionsService.getUser(String(receiver_id));
            if (receiverSocket)
                receiverSocket.send(JSON.stringify({ conversation_id: parsedMessage.conversation_id, message: parsedMessage.message }));

        })

        socket.on('close', async () => {
            /* console.debug('Removing user from map'); */
            await connectionsService.deleteUser(session.user_id);
        })
    }
}

module.exports = new WebSocketController();