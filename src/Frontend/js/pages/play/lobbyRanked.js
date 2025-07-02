import { LobbyMatchPage } from "./templates/lobbyMatch.js"

export const LobbyRankedPage = {
    template() {
        return LobbyMatchPage.template();
    },

    init() {
        const lobbySettingsListing = {
            id: 1,
            name: "Some lobby",
            map: "1v1-medium",
            mode: "modern",
            duration: "marathon"
        } //TODO: Get Lobby Settings from db

        const websocket = new WebSocket(`ws://${window.location.hostname}:8888/ws/${id}`); //Confirm websocket endpoint

        const titleElement = document.getElementById('lobby-title');
        titleElement.textContent = lobbySettingsListing.name
        const subtitleElement = document.getElementById('lobby-subtitle');
        subtitleElement.textContent = "Ranked Match Lobby"
        
        LobbyMatchPage.renderSlots(true);
        LobbyMatchPage.renderSettings();
        LobbyMatchPage.activateButtons();

        console.log('Lobby Ranked page loaded!')

        const isHost = false //ask redis if is host
        if (isHost) {
            const startButton = document.getElementById('btn-start')
            startButton.addEventListener('click', () => {
                const everyoneReady = false; //TODO: Ask db if everyone is ready
                if (everyoneReady) {
                    //TODO: Logic to start the game
                    this.startGame(websocket)
                    console.log("Everyone is ready. Starting game...")
                } else {
                    startButton.textContent = "Not everyone is ready!"
                    setTimeout(() => {
                        startButton.textContent = "Start"
                    }, 1000)
                }
            })
        }
    },

    startGame(websocket) {
        websocket.addEventListener('message', onInitMessage);

        // Putting all logic here makes sure that game only loads once the connection is established
        async function onInitMessage(event) {
            // This is a one-time message, so the listener must be removed immediately
            websocket.removeEventListener('message', onInitMessage);

            
            const message = JSON.parse(event.data);
            //This is safe because message.type will be undefined if message is not Adto. Is it good practice? Fuck if I know lol
            if (message.type === "AssignID") {
                const dto = message.dto;
                const clientID = dto.clientID;

                // UserCustoms will be the object that will be generated at runtime
                const gameConfigs = applyDevCustoms(UserCustoms); //TODO: Get user customs from REDIS 
                const clientGameConfigs = buildCAppConfigs(gameConfigs, clientID, websocket, getElementById(''))
                await App.init(clientGameConfigs);
            }
        }
    }


}