import redisPubSub = require('../../Infrastructure/config/RedisPubSub')


class EventBroadcast {

    async subscribe(topic: string, callback: (message: any) => void): Promise<void> {
        redisPubSub.default.subscribe(topic, (message: any, channel: string) => {
            console.log('MESSAGE = ' + message);
            console.log('TOPIC = ' + channel);
            callback(message);
        });
    }

    async publish(topic: string, value: unknown): Promise<any> {
        return redisPubSub.default.publish(topic, JSON.stringify(value));
    }

}

export default new EventBroadcast();