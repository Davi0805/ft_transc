
class ConnectedUsersRepository {
    constructor()
    {
        this.users = new Map();
    }

    async addUser(userId, socket)
    {
        return this.users.set(userId, socket);
    }

    async deleteUser(userId)
    {
        return this.users.delete(userId);
    }

    async getUser(userId)
    {
        return await this.users.get(userId);
    }

    async countUsers()
    {
        return await this.users.size;
    }
}

module.exports = new ConnectedUsersRepository();