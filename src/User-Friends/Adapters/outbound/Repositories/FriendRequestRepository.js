const db = require('../../../Infrastructure/config/Sqlite');

class FriendRequestRepository {

    async getAll()
    {
        return await db.raw('SELECT * FROM friend_requests');
    }

    async newRequest(sender_id, receiver_id) {
        return await db.raw('INSERT INTO friend_requests '+
            '(from_user_id, to_user_id, status) VALUES (?, ?, ?)',
             [sender_id, receiver_id, 'PENDING']);
    }

}

module.exports = new FriendRequestRepository();