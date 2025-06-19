const redis = require('../../../Infrastructure/config/RedisPubSub');


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
}

module.exports = new EventBroadcast();