
class ConnectedUsersRepository {
    constructor()
    {
        if (!!ConnectedUsersRepository.instance)
            return ConnectedUsersRepository.instance;

        ConnectedUsersRepository.instance = this;
        
        this.users = new Map();

        return this;
    }

    async getAllValues()
    {
        return this.users.entries();
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