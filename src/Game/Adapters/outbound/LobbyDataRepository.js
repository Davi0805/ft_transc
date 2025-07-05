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

        redis.hSet(`lobby:${lobby_id}`, 'users', JSON.stringify([]));

        await redis.expire(`lobby:${lobby_id}`, 60);
    }


    // TTL - Time To Leave
    // method to check and remove TTL
    async isTemp(lobby_id)
    {
        const ttl = await redis.ttl(`lobby:${lobby_id}`);
        if (ttl == -1) console.log('No ttl on it');
        else if (ttl > 0) 
        {
            const result = await redis.persist(`lobby:${lobby_id}`);
            console.log(result ? 'ttl removed' : 'tll failed to remove');
        }
    }

    async addUser(lobby_id, data)
    {
        const lobby = await this.get(lobby_id);
        if (lobby) this.isTemp(lobby_id);
        lobby.users.push({id: data.user_id, ready: false});
        await redis.hSet(`lobby:${lobby_id}`, 'users', JSON.stringify(lobby.users));
    }

    async removeUser(lobby_id, user_id)
    {
    }

    async setUserState(lobby_id, user_id, ready_state)
    {
        if (ready_state != false && ready_state != true) throw new Error('Invalid argument');
        const lobby = await this.get(lobby_id);
        const user = lobby.users.find(u => u.id == user_id);
        user.ready = ready_state;
        await redis.hSet(`lobby:${lobby_id}`, 'users', JSON.stringify(lobby.users));
    }

    async setUserPosition(lobby_id, position)
    {

    }

    async get(lobby_id)
    {
        const result = await redis.hGetAll(`lobby:${lobby_id}`);
        //console.log('RAW GET = ' + result.name + ' | JSON GET = ' + JSON.stringify(result));
        result.users = JSON.parse(result.users);
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