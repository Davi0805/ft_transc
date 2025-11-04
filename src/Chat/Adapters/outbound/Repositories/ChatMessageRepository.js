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

    async setMessagesRead(conversation_id, user_id)
    {
        return db.raw('UPDATE messages SET unread = 0' 
            + ' WHERE conversation_id = ? AND from_user_id != ?', [conversation_id, user_id]);
    }

    async saveInviteMessage(conversation_id, from_user_id, lobbyId)
    {
        return await db.raw('INSERT INTO messages '+
                            '(conversation_id, from_user_id, message_content, metadata) '+
                            'VALUES (?, ?, ?, ?)',
                            [Number(conversation_id), Number(from_user_id), 'match_invite', Number(lobbyId)]);
    }

    // with metadata
/*     async saveSpecialMessage()
    {

    } */
}

module.exports = new ChatMessageRepository();