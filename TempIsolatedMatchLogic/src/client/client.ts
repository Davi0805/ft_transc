import { App } from './scripts/system/App';
import { buildCAppConfigs } from '../misc/buildGameOptions';
import { applyDevCustoms, UserCustoms } from '../misc/gameOptions';
import { Adto } from '../misc/types';

// This websocket is the client's connection (which has been probably open way before)
const websocket = new WebSocket(`ws://${window.location.hostname}:3000/ws`);

// This makes sure the app only starts once the init message arrives
websocket.addEventListener('message', onInitMessage);

// Putting all logic here makes sure that game only loads once the connection is established
async function onInitMessage(event: MessageEvent<any>) {
    // This is a one-time message, so the listener must be removed immediately
    websocket.removeEventListener('message', onInitMessage);

    
    const message = JSON.parse(event.data) as Adto;
    //This is safe because message.type will be undefined if message is not Adto. Is it good practice? Fuck if I know lol
    if (message.type === "AssignID") {
        const dto = message.dto;
        const clientID = dto.clientID;

        // UserCustoms will be the object that will be generated at runtime
        const gameConfigs = applyDevCustoms(UserCustoms);
        const clientGameConfigs = buildCAppConfigs(gameConfigs, clientID, websocket) // 
        await App.init(clientGameConfigs);
    }
    
}



//Note: Nothing should be done with App before this is called!
