
PRAGMA foreign_keys = ON;

CREATE TABLE match (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score_team_1 INTEGER NOT NULL,
    score_team_2 INTEGER NOT NULL,
    score_team_3 INTEGER,
    score_team_4 INTEGER,
    tournament_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tournament_id) REFERENCES tournament(id)
);


CREATE TABLE player_matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    match_id INTEGER NOT NULL,

    FOREIGN KEY (match_id) REFERENCES match(id)
);

CREATE TABLE tournament (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    winner_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_customs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    paddle_sprite INTEGER
);
