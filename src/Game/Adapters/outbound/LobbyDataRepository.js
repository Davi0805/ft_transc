const redis = require('../../Infrastructure/config/Redis');
const connectedUsersRepository = require('../outbound/ConnectedUsersRepository');


/* 
*   {
*    "name": "Pato Caolho",
*    "type": "friendly",
*    "mode": "modern",
*    "duration": 120,
*    "map": "2v2-small",
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
        redis.hSet(`lobby:${lobby_id}`, 'slots_taken', data.slots_taken);
        redis.hSet(`lobby:${lobby_id}`, 'map_usr_max', data.map_usr_max);
        redis.hSet(`lobby:${lobby_id}`, 'round', data.round);

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
        if (lobby.users.length == 0) lobby.users.push({id: data.user_id, ready: false, host: true});
        else lobby.users.push({id: data.user_id, ready: false, host: false});
        await redis.hSet(`lobby:${lobby_id}`, 'users', JSON.stringify(lobby.users));
        return lobby;
    }

    // todo: make verifications on the service and decouple everything with the services
    async setPlayerPosition(lobby_id, user_id, data)
    {
        const lobby = await this.get(lobby_id);
        const user = lobby.users.find(u => u.id == user_id);
        user.team = data.team;
        user.role = data.role;
        await redis.hSet(`lobby:${lobby_id}`, 'users', JSON.stringify(lobby.users));

        // todo: this is reallyy coupled
        connectedUsersRepository.broadcastToLobby(lobby_id, {type: "position_update_event",
                                                            user_id: user_id, team: data.team,
                                                            role: data.role})
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
        // todo: this is reallyy coupled
        connectedUsersRepository.broadcastToLobby(lobby_id, {type: "ready_state_update_event",
                                                            user_id: user_id, ready: ready_state});
    }

    async setUserPosition(lobby_id, position)
    {

    }

    async getHostIdByLobbyId(lobby_id)
    {
        const lobby = await this.get(lobby_id);
        const host = lobby.users.find(u => u.host == true);
        return host.id;
    }


    /*
    export type TLobby = {
    id: number,
    hostID: number,
    name: string,
    host: string,
    type: TLobbyType, ok
    capacity: TMatchCapacity, ok
    map: TMapType, ok
    mode: TMatchMode, ok
    duration: TMatchDuration,
    round: number
    }*/
    async getLobbyToGameBuild(lobby_id)
    {
        const lobby = await this.get(lobby_id);
        const hostId = await this.getHostIdByLobbyId(lobby_id);
        return ({id: lobby_id,
                name: lobby.name,
                hostID: hostId,
                type: lobby.type,
                capacity: {taken: lobby.slots_taken, max: lobby.map_usr_max},
                map: lobby.map,
                mode: lobby.mode,
                duration: lobby.duration,
                round: lobby.round
        })
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