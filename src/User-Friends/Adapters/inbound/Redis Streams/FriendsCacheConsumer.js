const redis = require('../../../Infrastructure/config/RedisStream');
const redisService = require('../../../Application/Services/RedisService');

async function consumeFriendsCacheEvent()
{

  // todo: REFAC WITH CONSUMER GROUP
    while(true)
    {
        const stream = await redis.xRead([
            { 
                key: 'cacheFriends',
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
                  const parsedData = JSON.parse(data);
                  console.log('DATA CONSUMED = ' + data + '| PARSADO = '+ parsedData.user_id);
                  await redisService.cacheFriends(parsedData.user_id);
                } catch (err) {
                  console.error(err);
                }
              }
          }
      }
}

module.exports = consumeFriendsCacheEvent;