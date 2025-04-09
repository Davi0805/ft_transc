const db = require('../config/Sqlite');
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
        return db.raw('SELECT user_id, username, password_hash FROM users WHERE username = ?', [username]);
    }

    async save(user) {
        return db('users').insert(user);
    }
}

module.exports = new UserRepository();