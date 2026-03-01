import 'fastify';
import { RedisDataT } from './Infrastructure/config/Redis.ts';

declare module 'fastify' {
  interface FastifyRequest {
    session: RedisDataT;
  }
}