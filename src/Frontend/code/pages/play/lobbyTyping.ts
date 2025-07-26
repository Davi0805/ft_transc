import { SIDES, ROLES } from "../../match/matchSharedDependencies/sharedTypes"
import { CGameDTO, SGameDTO } from "../../match/matchSharedDependencies/dtos"
import { CAppConfigs } from "../../match/matchSharedDependencies/SetupDependencies"

//TYPES REPRESENTATIVE OF THE ENTITIES

export type TLobbyType = "friendly" | "ranked" | "tournament"
export type TMap = "2-players-small" | "2-players-medium" | "2-players-big" | "4-players-small" | "4-players-medium" | "4-players-big"
    | "2-teams-small" | "2-teams-medium" | "2-teams-big" | "4-teams-small" | "4-teams-medium" | "4-teams-big"
export type TMode = "classic" | "modern"
export type TDuration = "blitz" | "rapid" | "classical" | "long" | "marathon"


//SET TO NULL IF IT BECOMES EMPTY
export type TFriendlyPlayer = {
    //The ID of the player. It is different from the userID that controls it, becuase one user can have more than one player
    id: number,
    //The nickname chosen for the player
    nickname: string,
    //The paddle sprite chosen for the player
    spriteID: number
    //The position of the player
    team: SIDES,
    role: ROLES
}

//No more members are needed because, for ranked players, the info used belongs to the user
export type TRankedPlayer = {
    //The position of the player
    team: SIDES,
    role: ROLES
}

//SHOULD NEVER BE SET TO NULL AFTER BEING SET!!! (change the "participating" flag instead)
//Except for participating flag, All these will be calculated by tournament service
export type TTournamentPlayer = {
    //Tells if the player is currently participating in the tournament.
    participating: boolean
    //How many points the player currently has in the tournament
    score: number, //Def: 0
    //The userIDs of the players with whom this user played
    prevOpponents: number[], //Def: []
    //The Team Preference index. Indicates whether this user deserves to play on the left or right
    teamPref: number, //Def: 0
}

export type TLobbyUser = {
    //THE FOLLOWING ARE TAKEN FROM USER SETTINGS
    //The userID of the user
    id: number,
    //The username that will be shown to other players
    username: string,
    //The id of the Paddle Sprite
    spriteID: number,
    //The rating of the user. To be recalculated after every game
    rating: number

    //THE FOLLOWING ARE RELATED TO THE PARTICULAR LOBBY THEY ARE IN
    //Whether the user set themselves as ready or not
    ready: boolean, //Def: false
    //The player the user controls. Starts as null and is set when they choose to join a slot or apply for the tournament
    player: TFriendlyPlayer[] | TRankedPlayer | TTournamentPlayer | null //Def: null
}

export type TLobby = {
    id: number,
    //The userID of the host. I think that is better than having a field for every user sying if it is host or not
    hostID: number,
    //The name of the lobby
    name: string,
    //The type of the lobby (see above for options)
    type: TLobbyType,
    //Map of the lobby. Dictates how many and which slots exist (the capacity can be taken from crossing this info with the users' position)
    map: TMap,
    //Mode of lobby (see above for options). Tells if powerups will be present
    mode: TMode,
    //Duration of the matches (See above for options). Better saved as string and only convert to number when the match starts
    duration: TDuration,
    //Current round. Important for pairings in tournaments, and allows the same people to start a new game from the same lobby, keeping track of how many games they played
    round: number, //Def: 1
    //The users present in the lobby. 
    users: TLobbyUser[] //Def: [host]
}



//TYPES TO BE SENT

//GetLobbiesList()
export type LobbyInfoForDisplay = {
    //The lobby id. Allows a user to click on the lobby and go to it
    id: number 
    //Name of the lobby.
    name: string,
    //Username of the host. Can be gotten from TLobby.hostID
    host: string
    //Lobby Type
    type: TLobbyType,
    //The current capacity of the lobby. Takes into account participating users, not users in lobby.
    //taken can be deduceb by the amount of users with their players !== null and max can be deduced from map.
    capacity: { taken: number, max: number },

    map: TMap,
    mode: TMode,
    duration: TDuration
}
export type LobbiesListDTO = LobbyInfoForDisplay[]

//CreateLobby()
//Although this is a POST, IT SHOULD RETURN A TLOBBY WITH THE CONFIGS AND THE CREATOR AS ITS ONLY USER INSTEAD OF ONLY THE LOBBY_ID!
//This allows the creation page to fully init the LobbyService before changing page
export type LobbyCreationConfigsDTO = {
    name: string,
    type: TLobbyType,
    map: TMap,
    mode: TMode,
    duration: TDuration
}


export type TDynamicLobbySettings = Pick<TLobby, "map" | "mode" | "duration">

//server will receive these when...
export type InboundDTOMap = {
    //host updates the settings
    updateSettings: {
        settings: TDynamicLobbySettings
    }
    //user invites a new user to this lobby
    inviteUserToLobby: {
        userID: number
    }
    //user updates its ready state
    updateReadiness: {
        ready: boolean 
    },
    //user chooses a slot in a friendly lobby
    addFriendlyPlayer: {
        player: TFriendlyPlayer
    },
    //user removes a player from a slot
    removeFriendlyPlayer: {
        playerID: number //Note: This is the id of the player, NOT the user!
    }
    //user chooses a slot in a ranked lobby
    addRankedPlayer: {
        player: TRankedPlayer
    },
    //user removes itself from the picked slot
    removeRankedPlayer: null
    //user applies to the tournament of the lobby
    addTournamentPlayer: null //None of the member variables are chosen by the user
    //user withdraws from the tournament
    removeTournamentPlayer: null
    //host starts the game
    startGame: null,
    
    //Game dto:
    updateGame: CGameDTO //Dealt with in game
}

//server should broadcast these after...
export type OutboundDTOMap = {
    lobby: TLobby,
    //host updates the settings. If map changes, users should be filled with the current users so slots can be updated accordingly
    updateSettings: {
        settings: TDynamicLobbySettings
        users: TLobbyUser[] | null
    },
    //user updates its ready state
    updateReadiness: {
        userID: number,
        ready: boolean
    }
    //user is added to the lobby
    addLobbyUser: {
        user: TLobbyUser
    },
    //user leaves a lobby
    removeLobbyUser: {
        id: number
    }
    //user chooses a slot in a friendly lobby
    addFriendlyPlayer: {
        userID: number
        player: TFriendlyPlayer
    },
    //user removes one of its players from slot in a friendly lobby
    removeFriendlyPlayer: {
        playerID: number
    }
    //user chooses a slot in a ranked lobby
    addRankedPlayer: {
        userID: number
        player: TRankedPlayer
    },
    //user removes itself from slot in a ranked lobby
    removeRankedPlayer: {
        id: number 
    }
    //user applies to a tournament
    addTournamentPlayer: {
        userID: number,
        player: TTournamentPlayer
    }
    //user withdraws from tournament
    removeTournamentPlayer: {
        id: number
    }
    //host clicks start on tournament lobby
    displayPairings: {
        pairings: [number, number][]
    }
    //host starts the match
    startMatch: {
        configs: CAppConfigs
        //tournPairings: [number, number][] | null 
    }

    //Game dto:
    updateGame: SGameDTO //Dealt with in game
}

export type InboundDTO<T extends keyof InboundDTOMap = keyof InboundDTOMap> = {
    requestType: T,
    data: InboundDTOMap[T]
}

export type OutboundDTO = {
    [K in keyof OutboundDTOMap]: {
        requestType: K,
        data: OutboundDTOMap[K]
    }
}[keyof OutboundDTOMap]




//THE FOLLOWING ARE INTERMIDIARY TYPES

export type TTournPlayer = {
    id: number | null // Same as userID
    nick: string | null // To be taken from userid
    score: number //default: 0
    rating: number //get from userid
    prevOpponents: number[] //default[]
    teamDist: number //default: 0
    participating: boolean //default: true
    //TODO: IN TOURNAMENT SERVICE, ONLY PAIR PLAYERS THAT HAVE THIS FLAG SET TO TRUE!!!!
    ready: boolean
}

export type TMatchPlayer = {
    userID: number | null //Same as userID
    id: number | null, //To be generated.
    nickname: string | null //If null, take the nick from userid
    spriteID: number | null, //If null, take spriteID from settings of userid
    team: SIDES,
    role: ROLES,
    //leftControl: string,
    //rightControl: string,
    //ready: boolean
}