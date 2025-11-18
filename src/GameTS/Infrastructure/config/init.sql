PRAGMA foreign_keys = ON;


CREATE TABLE match (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_team_id INTEGER NOT NULL,
    second_team_id INTEGER NOT NULL,
    third_team_id INTEGER,
    fourth_team_id INTEGER,
    tournament_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (first_team_id) REFERENCES teams(id),
    FOREIGN KEY (second_team_id) REFERENCES teams(id),
    FOREIGN KEY (third_team_id) REFERENCES teams(id),
    FOREIGN KEY (fourth_team_id) REFERENCES teams(id),
    FOREIGN KEY (tournament_id) REFERENCES tournament(id)
);

CREATE TABLE player_matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    match_id INTEGER NOT NULL,

    FOREIGN KEY (match_id) REFERENCES match(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE tournament (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_id INTEGER,
    second_id INTEGER,
    third_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_customs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    paddle_sprite INTEGER
);

CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enum_value INTEGER NOT NULL,
    team_name VARCHAR(10)
);

CREATE TABLE maps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20) NOT NULL,
    max_slots INTEGER NOT NULL
);

-- Prepare the teams lookup table
INSERT INTO teams (enum_value, team_name) VALUES
(0, "LEFT"),
(1, "TOP"),
(2, "RIGHT"),
(3, "BOTTOM");

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



PRAGMA foreign_keys = ON;



INSERT INTO user_customs (user_id, paddle_sprite) VALUES
(1, 0),
(2, 1),
(3, 2),
(4, 0),
(5, 3),
(6, 1),
(7, 2),
(8, 0);


INSERT INTO tournament (first_id, second_id, third_id) VALUES
(1, 2, 3),
(4, 5, 6),
(7, 8, NULL);


INSERT INTO match (first_team_id, second_team_id, tournament_id)
VALUES
(1, 2, 1), 
(2, 3, 1), 
(1, 3, 1); 

INSERT INTO match (first_team_id, second_team_id, third_team_id, fourth_team_id, tournament_id)
VALUES
(1, 2, 3, 4, 2),
(4, 3, 2, 1, 2);

INSERT INTO match (first_team_id, second_team_id, tournament_id)
VALUES
(1, 3, 3),
(2, 4, 3);


INSERT INTO player_matches (team_id, user_id, match_id) VALUES
(1, 1, 1),
(2, 2, 1);
INSERT INTO player_matches (team_id, user_id, match_id) VALUES
(2, 3, 2),
(3, 4, 2);

INSERT INTO player_matches (team_id, user_id, match_id) VALUES
(1, 1, 3),
(3, 2, 3);

INSERT INTO player_matches (team_id, user_id, match_id) VALUES
(1, 5, 4),
(2, 6, 4),
(3, 7, 4),
(4, 8, 4);

INSERT INTO player_matches (team_id, user_id, match_id) VALUES
(4, 8, 5),
(3, 7, 5),
(2, 6, 5),
(1, 5, 5);

INSERT INTO player_matches (team_id, user_id, match_id) VALUES
(1, 1, 6),
(3, 3, 6);

INSERT INTO player_matches (team_id, user_id, match_id) VALUES
(2, 2, 7),
(4, 4, 7);



