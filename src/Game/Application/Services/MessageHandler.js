const lobbyRepo = require('../../Adapters/outbound/LobbyDataRepository');
const lobbyService = require('../../Application/Services/LobbyService');

class MessageHandler {

    async process(message, lobby_id, user_id)
    {
        const parsedMessage = JSON.parse(message);

        switch (parsedMessage.requestType) {
            case 'addRankedPlayer':
                lobbyService.setPlayerPosition(lobby_id, user_id, {team: parsedMessage.data.player.team,
                                                                 role: parsedMessage.data.player.role});
                break;
            case 'updateReadiness':
                lobbyService.setUserState(lobby_id, user_id, parsedMessage.data.ready);
                break;
            case 'updateSettings':
                lobbyService.updateLobbySettings(lobby_id, user_id, parsedMessage.data.settings);
                break;
            case 'removeRankedPlayer':
                lobbyService.removePlayerPosition(lobby_id, user_id);
                break;
            case 'inviteUserToLobby':
                break;
            case 'addFriendlyPlayer':
                break;
            case 'removeFriendlyPlayer':
                break;
            case 'addTournamentPlayer':
                break;
            case 'removeTournamentPlayer':
                break;
            case 'startGame':
                break;
            case 'updateGame':
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