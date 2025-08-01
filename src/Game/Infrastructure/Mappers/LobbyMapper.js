
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

    //!! WHAT TO DO WHEN THE DATA IS NOT DEFINED YET?
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
    round: number,
    users: TLobbyUser
    }*/
    lobbyDataToTLobby(lobbyData)
    {
        if (!lobbyData.users) lobbyData.users = [];
        return ({id: parseInt(lobbyData.id),
                name: lobbyData.name,
                hostID: parseInt(lobbyData.hostID),
                host: "mockHostName",
                type: lobbyData.type,
                capacity: {taken: parseInt(lobbyData.slots_taken),
                           max: parseInt(lobbyData.map_usr_max)
                },
                map: lobbyData.map,
                mode: lobbyData.mode,
                duration: lobbyData.duration,
                round: lobbyData.round,
                users: this.lobbyUsersBuilder(lobbyData.users, lobbyData.type)
                });
    }

    lobbyDataArrayToResponse(lobbyDataArray)
    {
        const array = [];
        lobbyDataArray.forEach(l => {
            array.push(this.lobbyDataToTLobby(l));
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
   lobbyUsersBuilder(users, lobbyType)
   {
        const TUsers = [];
        for (const u of users) {
            TUsers.push({
                id: u.id,
                //nickname: await eventBus.getNicknamesByUserId(u.id),
                nickname: 'mockNickname',
                spriteID: 1, //!!!! LEMBRAR DE TIRAR ESSE HARDCODED
                rating: 2, //!!! FAZ PARTE DO USER SERVICE INTER SERVIÇO
                ready: u.ready,
                player: (u.team && u.role) ? this.playerDataBuilder(u, lobbyType) : null
            });
        }
        return TUsers;
   }

    playerDataBuilder(userData, lobbyType)
    {
        switch (lobbyType) {
            case "friendly":
                return this.friendlyPlayerBuilder(userData);
            case "ranked":
                return this.rankedPlayerBuilder(userData);
            case "tournament":
                return this.tournamentPlayerBuilder(userData);
            default:
                break;
        }
    }

    tournamentPlayerBuilder(userData)
    {
        return {participating: userData.participating,
                score: (userData.score) ? userData.score : 0, 
                prevOpponents: (userData.prevOpponents) ? userData.prevOpponents : 0,
                teamPref: (userData.teamPref) ? userData.teamPref : 0
        }
    }    

    friendlyPlayerBuilder(userData)
    {
        return {id: userData.playerId, nickname: userData.playerNickname,
                spriteID: 1, team: userData.team, role: userData.role
                };
    }

    rankedPlayerBuilder(userData)
    {
        return {team: userData.team, role: userData.role};
    }

};

module.exports = new LobbyMapper();