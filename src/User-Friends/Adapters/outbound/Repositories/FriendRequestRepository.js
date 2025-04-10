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

    async listAllPendingRequest(user_id)
    {
        return await db.raw('SELECT fr.request_id, u.name AS sender_name, '+
                            'u.username AS sender_username, u.user_image AS sender_image '+
                            'FROM friend_requests fr '+
                            'JOIN users u '+
                            'ON fr.to_user_id = u.user_id '+
                            'WHERE fr.to_user_id = ? AND fr.status = ?', [user_id, 'PENDING']);
    }

    async acceptRequest(request_id, user_id)
    {
        return await db.raw('UPDATE friend_requests '+
                            'SET status = ? '+
                            'WHERE request_id = ? AND to_user_id = ?',
                            ['ACCEPTED', request_id, user_id]
        );
    }

    async rejectRequest(request_id, user_id)
    {
        return await db.raw('UPDATE friend_requests '+
                            'SET status = ? '+
                            'WHERE request_id = ? AND to_user_id = ?',
                            ['REJECTED', request_id, user_id]
        );
    }

    async getAllFriends(user_id)
    {
        return await db.raw('SELECT u.user_id, u.name, u.username, u.email, u.user_image, '+
                            'fr.created_at as friends_since '+
                            'FROM users u '+
                            'JOIN friend_requests fr '+
                            'ON (fr.from_user_id = u.user_id OR fr.to_user_id = u.user_id) '+
                            'WHERE fr.status = ? AND '+
                            '('+
                            '(fr.from_user_id = ? AND fr.to_user_id = u.user_id) OR '+
                            '(fr.to_user_id = ? AND fr.from_user_id = u.user_id) ', 
                            ['ACCEPTED', user_id, user_id]);
    }
}

module.exports = new FriendRequestRepository();