const lobbyRepo = require('../../Adapters/outbound/LobbyDataRepository');

class MessageHandler {

    async process(message, lobby_id, user_id)
    {
        const parsedMessage = JSON.parse(message);

        console.log("FUCK ME")
        console.log(parsedMessage)
        console.log("FUCK YOU")
        switch (parsedMessage.requestType) {
            case ('updateSettings'):
                lobbyRepo.updateSettings(lobby_id, parsedMessage.data.settings)
        }
        if (parsedMessage.type == 'position_update')
            lobbyRepo.setPlayerPosition(lobby_id, user_id, {team: parsedMessage.team, role: parsedMessage.role});
        else if(parsedMessage.type == 'ready_state_update')
            lobbyRepo.setUserState(lobby_id, user_id, parsedMessage.ready);
    }

    async eventSelector()
    {
        
    }

};

module.exports = new MessageHandler();