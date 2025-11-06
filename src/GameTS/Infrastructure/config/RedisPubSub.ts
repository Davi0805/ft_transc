import { createClient } from "redis";

export type RedisDataT = Record<string, string>

const RedisPubSub = createClient({
    url: 'redis://redis:6378'
})

RedisPubSub.on('error', err => {
console.error('RedisPubSub error:', err);
});

RedisPubSub.connect();

export default RedisPubSub;