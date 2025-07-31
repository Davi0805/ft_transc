import Fastify from 'fastify'
import FastifyStatic from '@fastify/static' // allows fastify to send whole files at a time
import FastifyWebsocket from '@fastify/websocket'; // allows fastify to handle websockets
import { WebSocket } from 'ws' // lowlevel type of the websocket to be used by the websocket plugin. Needed to be able to declare an array of those objects
import path from 'path' // utility to work with paths
import { applyDevCustoms, UserCustoms } from '../shared/SetupDependencies.js';
import { Adto, CGameDTO } from '../shared/dtos.js';
import ServerGame from './ServerGame.js';
import { buildSGameConfigs } from './setup.js';



const WEBSITE_ROOT_RELATIVE_PATH = '../../public';
const CLIENT_ENTRYPOINT = 'index.html';
const SERVER_PORT = 3000;
const SERVER_HOST = '0.0.0.0'; // 127.0.0.1 for local machine only, 0.0.0.0 for entire network

const gameConfigs = applyDevCustoms(UserCustoms);
const serverGameConfigs = buildSGameConfigs(gameConfigs);
// Creates a game, waiting for players to connect
const game = new ServerGame(serverGameConfigs); // TODO this should probably only be created when a game is created
//game.startGameLoop();
const clients: WebSocket[] = [];

// Broadcasts the game state to all clients
game.startBroadcast(clients)


const fastify = Fastify();

// Plugins must be registered so fastify can use them
fastify.register(FastifyStatic, {
    root: path.join(import.meta.dirname, WEBSITE_ROOT_RELATIVE_PATH) // import.meta.dirname is the way to get the dirname in esmodules
});

fastify.register(FastifyWebsocket);
fastify.register(async (fastify) => {
    // Behavior of the websocket
    fastify.get('/ws', {websocket: true}, (socket, _request) => {
        // This ID identifies the socket (not necessarily the player!) This allows several players per client
        const clientId = clients.length;
        console.log(`Client ${clientId} joined`)

        // Tells the client what ID it has and which humans are associated with it
        const data: Adto = {
            type: "AssignID",
            dto: {
                clientID: clientId,
                humansID: []
            }
        }; 
        socket.send(JSON.stringify(data));

        clients.push(socket);
        
        if (clients.length >= gameConfigs.clients.length) { // TODO: CHANGE FOR CLIENTS AMOUNT!
            game.startGameLoop();
        }
        // Whenever this particular client sends a message, it is forwarded to the game to take care of it
        socket.on('message', (message) => {
            const dto = JSON.parse(message.toString()) as CGameDTO;
            game.processClientDTO(dto);
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