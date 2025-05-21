import { App } from './scripts/system/App';
import { buildCAppConfigs } from '../misc/buildGameOptions';
import { DevCustoms, UserCustoms } from '../misc/gameOptions';



const websocket = new WebSocket(`ws://${window.location.hostname}:3000/ws`);
websocket.addEventListener('message', onInitMessage);


async function onInitMessage(event: MessageEvent<any>) {
    websocket.removeEventListener('message', onInitMessage);
    const message = JSON.parse(event.data);
    const clientID = message.id;
    console.log("CLIENTID: ", message.id)

    const gameConfigs = buildCAppConfigs(DevCustoms, UserCustoms, clientID, websocket)

    await App.init(gameConfigs);
}

//Note: Nothing should be done with App before this is called!
