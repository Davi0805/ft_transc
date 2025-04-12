const redis = require('../../../Infrastructure/config/RedisStream');
const conversationService = require('../../../Application/Services/ConversationsService');
const connectedUsersService = require('../../../Application/Services/ConnectionsService');

async function consumeNewFriendsEvent()
{

  // todo: REFAC WITH CONSUMER GROUP
    while(true)
    {
        const stream = await redis.xRead([
            { 
                key: 'newFriendshipEvent',
                id: '$',                   
            }
        ], {
            BLOCK: 0,
        });


        // todo: try to find out why da fuck is needed all of this
        // todo: just to desserialize from redis streams, and for real
        // todo: what a trash documentation for the redis streams to node js
        if (stream && stream.length > 0) {
            const messages = stream[0].messages;

            for (const message of messages) {
                const characters = Object.entries(message.message)
                  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                  .map(entry => entry[1])
                  .join('');
              
                try {
                  const data = JSON.parse(characters);
                  console.log('IS IT WORKING ???? | USERID1 = ' + data.user1 + ' | USERID2 = ' + data.user2);
                  
                  // todo: modify the type of data that is been stored in redis, cause
                  // todo: on that you never know what type it is
                  const user1Socket = await connectedUsersService.getUser(String(data.user1));
                  if (user1Socket) {
                    await user1Socket.send(JSON.stringify({ conversation_id: '<ID DA CONVERSA>',
                      message: 'You now can talk with user ' + data.user2, metadata: 'newConversation'})); 
                  }
                  
                  // todo: query should return the new conversation_id
                  await conversationService.save(data.user1, data.user2);
                  
                  
                } catch (err) {
                  console.error('Failed to handle message:', err);
                }
              }
          }
      }
}

module.exports = consumeNewFriendsEvent;