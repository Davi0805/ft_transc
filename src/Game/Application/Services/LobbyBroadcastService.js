const connPlyrsRepo = require('../../Adapters/outbound/ConnectedUsersRepository');
const lobbyMapper = require('../../Infrastructure/Mappers/LobbyMapper');

class LobbyBroadcastService {
    async updateSettings(lobbyId, lobby)
    {
        const msg = {
            requestType: 'updateSettings',
            data: {
                users: lobbyMapper.lobbyUsersBuilder(lobby.users, lobby.type),
                settings: {
                    mode: lobby.mode,
                    map: lobby.map,
                    duration: lobby.duration
                }
            }
        };
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

    async userJoined(lobbyId, userId)
    {
        const msg = {
            requestType: 'userJoined',
            data: {
                id: userId
            }
        };
        connPlyrsRepo.broadcastToOtherLobbyUsers(lobbyId, msg);
    }

    async userLeft(lobbyId, userId)
    {
        const msg = {
            requestType: 'userLeft',
            data: {
                id: userId
            }
        };
        connPlyrsRepo.broadcastToOtherLobbyUsers(lobbyId, msg);
    }
};

module.exports = new LobbyBroadcastService();