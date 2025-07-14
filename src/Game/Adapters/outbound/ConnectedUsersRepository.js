
class ConnectedUsersRepository {
    constructor()
    {
        if (!!ConnectedUsersRepository.instance)
            return ConnectedUsersRepository.instance;

        ConnectedUsersRepository.instance = this;
        
        this.lobbies = new Map();

        return this;
    }

    async broadcastToLobby(lobby_id, message)
    {
        const lobby = this.lobbies.get(lobby_id);
        if (lobby)
        {
            lobby.forEach(u => {
                u.socket.send(JSON.stringify(message));
            });
        }
    }

    async getAllValues()
    {
        return this.lobbies.entries();
    }

    async addUser(lobby_id, userId, socket)
    {
        if (!this.lobbies.get(lobby_id))
            this.lobbies.set(lobby_id, []);
        this.broadcastToLobby(lobby_id, {type: 'user_joined_event',
                                        user_id: userId});
        const arr = this.lobbies.get(lobby_id);
        arr.push({user_id: userId, socket: socket});
        this.lobbies.set(lobby_id, arr);
    }

    async deleteUser(lobby_id, userId)
    {
        const lobby = this.lobbies.get(lobby_id);
        const cleanArr = lobby.filter(u => u.user_id !== userId);
        this.lobbies.set(lobby_id, cleanArr);
    }

    async getUserSocket(lobby_id, userId)
    {
        const lobby = await this.lobbies.get(lobby_id);
        const userSocket = lobby.find(u => u.user_id == userId);
        return userSocket;
    }
}

module.exports = new ConnectedUsersRepository();