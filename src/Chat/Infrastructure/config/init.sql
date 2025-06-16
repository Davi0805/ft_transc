PRAGMA foreign_keys = ON;
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,    UNIQUE(user1_id, user2_id),
    CHECK (user1_id != user2_id)
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    from_user_id INTEGER NOT NULL,
    message_content TEXT NOT NULL,
    unread BOOLEAN DEFAULT 1,
    metadata TEXT, -- maybe i can use to save match urls or tokens for match invites    
  
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- TODO MOCK DATA CONVERSATIONS 
INSERT INTO conversations (user1_id, user2_id) VALUES
(1, 2), -- Artur <-> Maria
(1, 3); -- Artur <-> João

-- MOCK DATA MESSAGES
-- Conversa 1: Artur (1) <-> Maria (2)
INSERT INTO messages (conversation_id, from_user_id, message_content, metadata) VALUES
(1, 1, 'Olá Maria!', NULL),
(1, 2, 'Olá Artur! Tudo bem?', NULL),
(1, 1, 'Tudo ótimo, e contigo?', NULL);

-- Conversa 2: Artur (1) <-> João (3)
INSERT INTO messages (conversation_id, from_user_id, message_content, metadata) VALUES
(2, 1, 'E aí João!', NULL),
(2, 3, 'Oi Artur! Bora jogar uma partida?', NULL),
(2, 1, 'Bora sim!', NULL);


CREATE INDEX idx_conversation_id ON conversations(id);

CREATE INDEX idx_messages_from_user_id ON messages(from_user_id);
 -- idk if necessary
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);