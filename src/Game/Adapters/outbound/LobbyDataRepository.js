const redis = require('../../Infrastructure/config/Redis');




/* 
*   {
*    "name": "Pato Caolho",
*    "type": "friendly",
*    "mode": "modern",
*    "duration": 120,
*    "map": "2v2-small",
*    "map_usr_min": 2,
*    "map_usr_max": 4,
*    "users": []
*   }
*/
class LobbyDataRepository {

    async save(lobby_id, data)
    {
        console.log('Lobby id = ' + lobby_id + ' | Data = ' + data);

        // TODO: later find the documentation to send it all at once
        redis.hSet(`lobby:${lobby_id}`, 'name', data.name);
        redis.hSet(`lobby:${lobby_id}`, 'type', data.type);
        redis.hSet(`lobby:${lobby_id}`, 'mode', data.mode);
        redis.hSet(`lobby:${lobby_id}`, 'duration', data.duration);
        redis.hSet(`lobby:${lobby_id}`, 'map', data.map);
        redis.hSet(`lobby:${lobby_id}`, 'map_usr_min', data.map_usr_min);
        redis.hSet(`lobby:${lobby_id}`, 'map_usr_max', data.map_usr_max);

        //redis.hSet(`lobby:${lobby_id}`, 'users', data.users);

        await redis.expire(`lobby:${lobby_id}`, 60);
    }

    async addUser(lobby_id, data)
    {

    }

    async get(lobby_id)
    {
        const result = await redis.hGetAll(`lobby:${lobby_id}`);
        //console.log('RAW GET = ' + result.name + ' | JSON GET = ' + JSON.stringify(result));
        return result;
    }

    async getAllLobbies() {
    const lobbies = {};
    for await (const key of redis.scanIterator({
        MATCH: 'lobby:*',
        COUNT: 100
    })) {
        const data = await redis.hGetAll(key);
        console.log(`Data for ${key}:`, data);
        lobbies[key] = data;
    }
    return lobbies;
}


}

module.exports = new LobbyDataRepository();