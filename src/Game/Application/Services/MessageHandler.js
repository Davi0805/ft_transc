const lobbyRepo = require('../../Adapters/outbound/LobbyDataRepository');
const lobbyService = require('../../Application/Services/LobbyService');

class MessageHandler {

    async process(message, lobby_id, user_id)
    {
        const parsedMessage = JSON.parse(message);

        switch (parsedMessage.requestType) {
            case 'addRankedPlayer':
                lobbyService.setPlayerPosition(lobby_id, user_id, parsedMessage.data.player);
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
                lobbyService.inviteUserToLobby(lobby_id, user_id, parsedMessage.data.userID);
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

};

module.exports = new MessageHandler();