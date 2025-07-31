const db = require('../../Infrastructure/config/Sqlite');

class MapRepository {
    async getAll()
    {
        return await db.raw('SELECT * FROM maps');
    }

    async getById(map_id)
    {
        return await db.raw('SELECT * FROM maps WHERE id = ?', [map_id]);
    }

    async getByName(map_name)
    {
        console.log(map_name)
        return await db.raw('SELECT * FROM maps WHERE name = ?', [map_name]);
    }
}

module.exports = new MapRepository();