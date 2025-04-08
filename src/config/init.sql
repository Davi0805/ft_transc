
-- why they changed the db of this project from postgres to sqlite
-- just why????

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_image VARCHAR(255)
);

-- just a simple index to optimize queries filtering by username
-- i dont really know if this really work in sqlite, but u know
-- WHY NOT?
CREATE INDEX idx_username ON users (username);