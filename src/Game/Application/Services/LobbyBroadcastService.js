const connPlyrsRepo = require('../../Adapters/outbound/ConnectedUsersRepository');

class LobbyBroadcastService {
    async updateSettings(lobbyId)
    {
        const msg = {
            requestType: 'updateSettings',
            data: {} //TODO:
        }
        connPlyrsRepo.broadcastToLobby(lobbyId, msg);
    }

    async updateReadiness(lobbyId, userId, readyState)
    {
        const msg = {
            requestType: 'updateReadiness',
            data: {
                ready: readyState,
                userID: userId
            }
        };
        connPlyrsRepo.broadcastToLobby(lobbyId, msg);
    }

    async addRankedPlayer(lobbyId, userId, position)
    {
        const msg = {
            requestType: 'addRankedPlayer',
            data: {
                player: {
                    team: position.team,
                    role: position.role
                },
                userID: userId
            }
        };
        connPlyrsRepo.broadcastToLobby(lobbyId, msg);
    }

    async removeRankedPlayer(lobbyId, userId)
    {
        const msg = {
            requestType: 'removeRankedPlayer',
            data: {
                id: userId
            }
        };
        connPlyrsRepo.broadcastToLobby(lobbyId, msg);
    }
};

module.exports = new LobbyBroadcastService();