const db = require('../../../Infrastructure/config/Sqlite');
// remember to use await in the queries


// idk if we allowed to use ORM, so i will write it all guys
class UserRepository {

    // using '*' while theres still no frontend user interface defined
    async findAll() {
        return db.raw('SELECT * FROM users');
    }

    async findById(id) {
        return db.raw('SELECT * FROM users WHERE user_id = ?', [id]);
    }

    async findByUsername(username)
    {
        return db.raw('SELECT * FROM users WHERE username = ?', [username]);
    }

    async getProfileDataByUsername(username, originUserId) {
        return db.raw(
            `
            SELECT 
                u.user_id,
                u.name AS nickname,
                u.username,
                u.rating as ranking,
                COUNT(DISTINCT f.request_id) AS friendsCount,
                MAX(
                    CASE 
                        WHEN (f.from_user_id = ? AND f.to_user_id = u.user_id)
                        OR (f.from_user_id = u.user_id AND f.to_user_id = ?)
                        THEN 1 ELSE 0
                    END
                ) AS is_friend
            FROM users u
            LEFT JOIN friend_requests f
                ON (
                    (f.from_user_id = u.user_id AND f.status = 'ACCEPTED')
                    OR
                    (f.to_user_id = u.user_id AND f.status = 'ACCEPTED')
                )
            WHERE u.username = ?
            GROUP BY u.user_id, u.name, u.username, u.rating
            `,
            [originUserId, originUserId, username]
        );
    }


    async save(user) {
        return db('users').insert(user);
    }

    async updatePassword(user)
    {
        return db.raw('UPDATE users SET password_hash = ? WHERE user_id = ? AND password_hash = ?',
            [user.new_password, user.id, user.old_password]
        );
    }

    async updateName(user)
    {
        return db.raw('UPDATE users SET name = ? WHERE user_id = ?',
            [user.name, user.id]
        );
    }

    async updateEmail(user)
    {
        return db.raw('UPDATE users SET email = ? WHERE user_id = ?', [user.email, user.id]);
    }

    async addTwoFactorAuth(user_id, twofa_secret)
    {
        return db.raw('UPDATE users SET twofa_secret = ?, twofa_enabled = ? WHERE user_id = ?',
        [twofa_secret, true, user_id]);
    }

    async updateUserImagePath(path, user_id)
    {
        return db.raw('UPDATE users SET user_image = ? WHERE user_id = ?'
            , [path, user_id]
        );
    }
}

module.exports = new UserRepository();