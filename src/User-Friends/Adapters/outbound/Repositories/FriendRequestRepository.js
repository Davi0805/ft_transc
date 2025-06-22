const db = require('../../../Infrastructure/config/Sqlite');
const exception = require('../../../Infrastructure/config/CustomException');

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
        return await db.raw('SELECT u.user_id AS sender_id, fr.request_id, u.name AS sender_name, '+
                            'u.username AS sender_username '+
                            'FROM friend_requests fr '+
                            'JOIN users u '+
                            'ON fr.from_user_id = u.user_id '+
                            'WHERE fr.to_user_id = ? AND fr.status = ?', [user_id, 'PENDING']);
    }

    async acceptRequest(request_id, user_id)
    {
        try {
            const result = await db('friend_requests')
            .where({ request_id, to_user_id: user_id })
            .update({ status: 'ACCEPTED' })
            .returning(['from_user_id', 'to_user_id']);
            return result[0];
        } catch (error) {
            throw exception('Failed to accept request', 400);     
        }
    }

    async rejectRequest(request_id, user_id)
    {
        return await db.raw('UPDATE friend_requests '+
                            'SET status = ? '+
                            'WHERE request_id = ? AND to_user_id = ?',
                            ['REJECTED', request_id, user_id]
        );
    }

    async blockFriend(target_id, user_id)
    {
        return await db.raw('UPDATE friend_requests ' +
                            'SET status = ?, blocked_by = ? ' +
                            'WHERE (from_user_id = ? OR to_user_id = ?) AND status = ? ' +
                            'AND (from_user_id = ? OR to_user_id = ?)'
                            , ['BLOCKED', user_id, target_id, target_id, 'ACCEPTED', user_id, user_id]);
    }

    async unblockFriend(target_id, user_id)
    {
        return await db.raw('UPDATE friend_requests ' +
                            'SET status = ?, blocked_by = ? '+
                            'WHERE (from_user_id = ? OR to_user_id = ?) AND status = ? '+
                            'AND blocked_by = ?',
                            ['ACCEPTED', null, target_id, target_id, 'BLOCKED', user_id]
                            );
    }

    async getAllFriends(user_id)
    {
        return await db.raw('SELECT u.user_id, u.name, u.username, u.email, u.user_image '+
                            'FROM users u '+
                            'JOIN friend_requests fr '+
                            'ON (fr.from_user_id = u.user_id OR fr.to_user_id = u.user_id) '+
                            'WHERE fr.status = ? AND '+
                            '('+
                            '(fr.from_user_id = ? AND fr.to_user_id = u.user_id) OR '+
                            '(fr.to_user_id = ? AND fr.from_user_id = u.user_id)'+
                            ')', 
                            ['ACCEPTED', user_id, user_id]);
    }


}

module.exports = new FriendRequestRepository();