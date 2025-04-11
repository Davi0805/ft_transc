const db = require('../../../Infrastructure/config/Sqlite');

class ChatMessageRepository {
    async findAllByConversationId(conversation_id)
    {
        return await db.raw('SELECT * FROM messages '+
                            'WHERE conversation_id = ?',
                            [conversation_id]
        );
    }

    async saveMessage(conversation_id, from_user_id, message_content)
    {
        return await db.raw('INSERT INTO messages '+
                            '(conversation_id, from_user_id, message_content) '+
                            'VALUES (?, ?, ?)',
                            [conversation_id, from_user_id, message_content]);
    }

    // with metadata
/*     async saveSpecialMessage()
    {

    } */
}

module.exports = new ChatMessageRepository();