const db = require('../../../Infrastructure/config/Sqlite');

class blockRelationsRepository {

    async getAllBlocks(userId)
    {
        return await db.raw('SELECT * FROM block_relationships '
                    + 'WHERE from_user_id = ?'
                    , [userId]);
    }

    async newBlock(userId, targetId)
    {
        return await db.raw('INSERT INTO block_relationships '
                        + '(from_user_id, blocked_user_id) VALUES '
                        + '(?, ?)', [userId, targetId]);
    }

    async unblock(userId, targetId)
    {
        return await db.raw('DELETE FROM block_relationships '
                        + 'WHERE from_user_id = ? AND blocked_user_id = ?',
                        [userId, targetId]);
    }

    async isUserBlocked(userId, targetId)
    {
        return await db.raw('SELECT * FROM block_relationships '
                        + 'WHERE from_user_id = ? AND blocked_user_id = ?',
                        [userId, targetId]);
    }

};

module.exports = new blockRelationsRepository();