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
        return db.raw('SELECT user_id, username, password_hash, twofa_secret FROM users WHERE username = ?', [username]);
    }

    async save(user) {
        return db('users').insert(user);
    }

    async updateName(user)
    {
        return db.raw('UPDATE users SET name = ? WHERE user_id = ?',
            [user.name, user.id]
        );
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