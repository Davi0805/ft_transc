
class LobbyMapper {

    lobbyDataToResponse(lobbyData)
    {
        return ({id: parseInt(lobbyData.id),
                name: lobbyData.name,
                hostID: parseInt(lobbyData.hostID),
                type: lobbyData.type,
                capacity: {taken: parseInt(lobbyData.slots_taken),
                           max: parseInt(lobbyData.map_usr_max)
                },
                map: lobbyData.map,
                mode: lobbyData.mode,
                duration: lobbyData.duration    
                });
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
    lobbyDataToTLobby(lobbyData)
    {
        return ({id: parseInt(lobbyData.id),
                name: lobbyData.name,
                hostID: parseInt(lobbyData.hostID),
                type: lobbyData.type,
                capacity: {taken: parseInt(lobbyData.slots_taken),
                           max: parseInt(lobbyData.map_usr_max)
                },
                map: lobbyData.map,
                mode: lobbyData.mode,
                duration: lobbyData.duration,
                round: lobbyData.round
                });
    }

    lobbyDataArrayToResponse(lobbyDataArray)
    {
        const array = [];
        lobbyDataArray.forEach(l => {
            array.push(this.lobbyDataToResponse(l));
        });
        return array;
    }

    buildLobbyData(id, data, map, user_id)
    {
        return {id: id,
                name: data.name, type: data.type,
                mode: data.mode, duration: data.duration,
                map: data.map, slots_taken: 0, hostID: user_id,
                map_usr_max: map[0].max_slots, round: 0};
    }


    /*
    export type TUser = {
    //Stuff from database
    id: number,
    nickname: string,
    spriteID: number
    rating: number

    //Stuff about lobby
    ready: boolean, //Default is false
    participating: boolean //Default is false
    player: TFriendlyPlayer[] | TRankedPlayer | TTournamentPlayer //Depends on the type of lobby
    }
    */
};

module.exports = new LobbyMapper();