const lobbyRepo = require('../../Adapters/outbound/LobbyDataRepository');
const lobbyService = require('../../Application/Services/LobbyService');

class MessageHandler {

    async process(message, lobby_id, user_id)
    {
        const parsedMessage = JSON.parse(message);
        console.log(message);

        switch (parsedMessage.type) {
            case 'position_update':
                lobbyService.setPlayerPosition(lobby_id, user_id, {team: parsedMessage.team, role: parsedMessage.role});
                break;
            case 'ready_state_update':
                lobbyService.setUserState(lobby_id, user_id, parsedMessage.ready);
                break;
            default:
                break;
        }
    }

    async eventSelector()
    {
        
    }

};

module.exports = new MessageHandler();