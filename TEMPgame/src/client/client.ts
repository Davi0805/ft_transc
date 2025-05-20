import { App } from './scripts/system/App';
import { buildCAppConfigs } from '../misc/buildGameOptions';
import { DevCustoms, UserCustoms } from '../misc/gameOptions';

const websocket = new WebSocket(`ws://${window.location.hostname}:3000/ws`);
websocket.addEventListener('message', onInitMessage);


function onInitMessage(event: MessageEvent<any>) {
    const message = JSON.parse(event.data);
    const clientID = message.id;
    console.log("CLIENTID: ", message.id)

    const gameConfigs = buildCAppConfigs(DevCustoms, UserCustoms, clientID, websocket)

    App.init(gameConfigs); // Shouldn't this be async?
    websocket.removeEventListener('message', onInitMessage);
}

//Note: Nothing should be done with App before this is called!
