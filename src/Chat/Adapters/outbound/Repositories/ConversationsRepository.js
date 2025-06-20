const db = require('../../../Infrastructure/config/Sqlite');

class ConversationsRepository {

    async save(user1, user2)
    {
        /* return await db.raw('INSERT INTO conversations '+
                            '(user1_id, user2_id) VALUES (?, ?)',
                            [user1, user2]); */
                            const result = await db('conversations')
                                    .insert({user1_id: user1, user2_id: user2})
                                    .returning(['id']);
                            return result[0];
    }

    async getAllMyConversations(user_id)
    {
        return await db.raw('SELECT * FROM conversations '+
                            'WHERE user1_id = ? OR '+
                            'user2_id = ?', [user_id, user_id]
                        );
    }

    async getAllConversationsAndUnread(user_id) {
        return await db.raw(`
            SELECT 
                c.id,
                c.user1_id,
                c.user2_id,
                COUNT(CASE 
                    WHEN m.unread = 1 AND m.from_user_id != ? THEN 1 
                    ELSE NULL 
                END) AS unread_count
            FROM conversations c
            LEFT JOIN messages m ON c.id = m.conversation_id
            WHERE (c.user1_id = ? OR c.user2_id = ?)
            GROUP BY c.id, c.user1_id, c.user2_id
        `, [user_id, user_id, user_id]);
    }
    

    async getConversationById(conversation_id)
    {
        return await db.raw('SELECT user1_id AS user1, user2_id AS user2 '
                            + 'FROM conversations WHERE id = ?',
                            [conversation_id]);
    }
}

module.exports = new ConversationsRepository();