const db = require('../../../Infrastructure/config/Sqlite');

class FriendRequestRepository {

    async getAll()
    {
        return await db.raw('SELECT * FROM friend_requests');
    }

}

module.exports = FriendRequestRepository;