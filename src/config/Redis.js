const redis = require('redis');

const client = redis.createClient({
    socket: {
        port: 6378
    }
});

client.on('error', err => {
    console.error('Redis error:', err);
  });
  
  client.connect();
  
  module.exports = client;