const db = require('../../../Infrastructure/config/Sqlite');

class ConversationsRepository {

    async save(user1, user2)
    {
        return await db.raw('INSERT INTO conversations '+
                            '(user1_id, user2_id) VALUES (?, ?)',
                            [user1, user2]);
    }

    async getAllMyConversations(user_id)
    {
        return await db.raw('SELECT * FROM conversations '+
                            'WHERE user1_id = ? OR '+
                            'user2_id = ?', [user_id, user_id]
                        );
    }
}

module.exports = new ConversationsRepository();