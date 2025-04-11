
PRAGMA foreign_keys = ON;

CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,

    UNIQUE(user1_id, user2_id),
    CHECK (user1_id != user2_id)
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    from_user_id INTEGER NOT NULL,
    message_content TEXT NOT NULL,
    metadata TEXT, -- maybe i can use to save match urls or tokens for match invites
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);


CREATE INDEX idx_conversation_id ON conversations(id);
CREATE INDEX idx_messages_from_user_id ON messages(from_user_id);
 -- idk if necessary
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);