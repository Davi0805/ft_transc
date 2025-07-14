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

CREATE TABLE maps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20) NOT NULL,
    max_slots INTEGER NOT NULL
);

-- Insert mock matches
INSERT INTO match (score_team_1, score_team_2, score_team_3, score_team_4, tournament_id) VALUES
(3, 2, NULL, NULL, NULL),
(1, 1, 0, 2, NULL),
(4, 4, 2, NULL, NULL);

-- Insert mock player_matches
INSERT INTO player_matches (team_id, user_id, match_id) VALUES
(1, 101, 1),
(1, 102, 1),
(2, 103, 1),
(2, 104, 1),

(1, 201, 2),
(1, 202, 2),
(2, 203, 2),
(3, 204, 2),
(4, 205, 2),

(1, 301, 3),
(2, 302, 3),
(2, 303, 3),
(3, 304, 3);

-- Insert maps
INSERT INTO maps (name, max_slots) VALUES
("2-players-small", 2),
("2-players-medium", 2),
("2-players-big", 2),
("4-players-small", 4),
("4-players-medium", 4),
("4-players-big", 4),
("2-teams-small", 4),
("2-teams-medium", 4),
("2-teams-big", 4),
("4-teams-small", 8),
("4-teams-medium", 8),
("4-teams-big", 8);
