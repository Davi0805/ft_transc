import Fastify from 'fastify'
import FastifyStatic from '@fastify/static' // allows fastify to send whole files at a time
import FastifyWebsocket from '@fastify/websocket'; // allows fastify to handle websockets
import { WebSocket } from 'ws' // lowlevel type of the websocket to be used by the websocket plugin. Needed to be able to declare an array of those objects
import path from 'path' // utility to work with paths
import { DevCustoms, UserCustoms } from '../misc/gameOptions.js';
import ServerGame from './ServerGame.js';
import { CGameDTO } from '../misc/types.js';
import { buildSGameConfigs } from './buildGameOptions.js';



const WEBSITE_ROOT_RELATIVE_PATH = '../../public';
const CLIENT_ENTRYPOINT = 'index.html';
const SERVER_PORT = 3000;
const SERVER_HOST = '127.0.0.1'; // 127.0.0.1 for local machine only, 0.0.0.0 for entire network


const gameConfigs = buildSGameConfigs(DevCustoms, UserCustoms);
// Creates a game, waiting for players to connect
const game = new ServerGame(gameConfigs); // TODO this should probably only be created when a game is created
game.startGameLoop();
const clients: WebSocket[] = [];

// Broadcasts the game state to all clients
const broadcastRate = 1000 / 60; // In milliseconds
// The following pattern is safer than using setInterval(), because it makes sure that the previous iteration is 
// finished before trying to broadcast again.
(function loop() {
  setTimeout(() => {
    const data = JSON.stringify({
        type: "gameDTO",
        gameDTO: game.getGameDTO()
    });
    for (var client of clients) {
      client.send(data)
    }
    loop(); // Will not cause a stack overflow because setTimeout() is asynchronous - only schedules the arrow function.
            // By the time it is time to execute it, the previous iteration is already done
  }, broadcastRate) // For now this is ok, but if it starts to get laggy, reduce Broadcast rate and implement client interpolation
})();

const fastify = Fastify();

// Plugins must be registered so fastify can use them
fastify.register(FastifyStatic, {
    root: path.join(import.meta.dirname, WEBSITE_ROOT_RELATIVE_PATH) // import.meta.dirname is the way to get the dirname in esmodules
});

fastify.register(FastifyWebsocket);
fastify.register(async (fastify) => {
    // Behavior of the websocket
    fastify.get('/ws', {websocket: true}, (socket, _request) => {
        const clientId = clients.length;
        
        const data = {
            type: "assignID",
            id: clientId
        }; 
        socket.send(JSON.stringify(data));

        clients.push(socket);
        console.log(`Client ${clientId} joined`);
        
        socket.on('message', (message) => {
            //console.log(message.toString())
            game.players[clientId].controls = (JSON.parse(message.toString()) as CGameDTO).controlsState; //TODO This will definitely have to be done from within the game Class to check if client is 
            //console.log(game.players[clientId].controls)
            console.log((JSON.parse(message.toString()) as CGameDTO))
        })
        socket.on('close', () => {
            console.log(`Client ${clientId} left`);
        })
    })
})

// The main route
fastify.get('/', (_request, reply) => {
    return (reply.sendFile(CLIENT_ENTRYPOINT))
})

// Start the server
try {
    await fastify.listen({ port: SERVER_PORT, host: SERVER_HOST });
    console.log("Server has started")
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}