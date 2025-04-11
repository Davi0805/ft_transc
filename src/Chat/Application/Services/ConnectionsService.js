const connectionRepo = require('../../Adapters/outbound/Repositories/ConnectedUsersRepository');

class ConnectionsService {
    async addUser(userId, socket)
    {
        return connectionRepo.addUser(userId, socket);
    }

    async deleteUser(userId)
    {
        return connectionRepo.deleteUser(userId);
    }

    async getUser(userId)
    {
        return await connectionRepo.getUser(userId);
    }

    async countUsers()
    {
        return await connectionRepo.countUsers();
    }
}

module.exports = new ConnectionsService();