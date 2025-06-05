const db = require('../../Infrastructure/config/Sqlite');

class UserCustomsRepository {
    async getByUserId(user_id)
    {
        return db.raw('SELECT * FROM user_customs WHERE user_id = ?',
                        [user_id]);
    }

    async createDefault(user_id)
    {
        return db('user_customs').insert({user_id: user_id, paddle_sprite: 1});
    }

    async update(paddle_sprite, user_id)
    {
        return db.raw('UPDATE user_customs SET paddle_sprite = ?' 
            + ' WHERE user_id = ?', [paddle_sprite, user_id]);
    }
}

module.exports = new UserCustomsRepository();