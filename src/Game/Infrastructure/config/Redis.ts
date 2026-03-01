import { createClient } from "redis";

export type RedisDataT = Record<string, string>

const redis = createClient({
    url: 'redis://redis:6378'
})

redis.on('error', err => {
console.error('Redis error:', err);
});

redis.connect();

export default redis;