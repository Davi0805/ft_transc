import { App } from './scripts/system/App';
import { buildCAppConfigs } from '../misc/buildGameOptions';
import { DevCustoms, UserCustoms } from '../misc/gameOptions';

const websocket = new WebSocket(`ws://${window.location.hostname}:3000/ws`);
websocket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const clientID = message.id;

    const gameConfigs = buildCAppConfigs(DevCustoms, UserCustoms, clientID, websocket)
    App.init(gameConfigs); // Shouldn't this be async?
});




//Note: Nothing should be done with App before this is called!
