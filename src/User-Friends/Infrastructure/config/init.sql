
-- why they changed the db of this project from postgres to sqlite
-- just why????

PRAGMA foreign_keys = ON;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_image VARCHAR(255),
    twofa_secret TEXT,
    twofa_enabled BOOLEAN DEFAULT FALSE
);
CREATE TABLE friend_requests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),

    FOREIGN KEY (from_user_id) REFERENCES users(user_id),
    FOREIGN KEY (to_user_id) REFERENCES users(user_id),

    UNIQUE(from_user_id, to_user_id),
    CHECK (from_user_id != to_user_id)
);

-- just a simple index to optimize queries filtering by username
-- i dont really know if this really work in sqlite, but u know
CREATE INDEX idx_username ON users (username);
CREATE INDEX idx_friend_requests_from_user ON friend_requests(from_user_id);
CREATE INDEX idx_friend_requests_to_user ON friend_requests(to_user_id);
CREATE INDEX idx_friend_requests_status ON friend_requests(status);

