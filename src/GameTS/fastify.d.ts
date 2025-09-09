import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    session: RedisDataT;
  }
}