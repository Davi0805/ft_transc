import { SIDES, ROLES } from "../../match/matchSharedDependencies/sharedTypes"

type TLobbyType = "friendly" | "ranked" | "tournament"
type TMap = "2-players-small" | "2-players-medium" | "2-players-big" | "4-players-small" | "4-players-medium" | "4-players-big"
    | "2-teams-small" | "2-teams-medium" | "2-teams-big" | "4-teams-small" | "4-teams-medium" | "4-teams-big"
type TMode = "classic" | "modern"
type TDuration = "blitz" | "rapid" | "classical" | "long" | "marathon"


//SET TO NULL IF IT BECOMES EMPTY
type TFriendlyPlayer = {
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
type TRankedPlayer = {
    //The position of the player
    team: SIDES,
    role: ROLES
}

//SHOULD NEVER BE SET TO NULL AFTER BEING SET!!! (change the "participating" flag instead)
//Except for participating flag, All these will be calculated by tournament service
type TTournamentPlayer = {
    //Tells if the player is currently participating in the tournament.
    participating: boolean
    //How many points the player currently has in the tournament
    score: number, //Def: 0
    //The userIDs of the players with whom this user played
    prevOpponents: number[], //Def: []
    //The Team Preference index. Indicates whether this user deserves to play on the left or right
    teamPref: number, //Def: 0
}

type TLobbyUser = {
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

type TLobby = {
    id: number,
    //The userID of the host. I think that is better than having a field for every user sying if it is host or not
    hostID: number,
    //The name of the lobby
    name: string,
    //The type of the lobby (see above for options)
    type: TLobbyType,
    //Map of the lobby. Dictates how many and which slots exist (the capacity can be taken from crossing this info with the users' position)
    map: TMap,
    //Mode of lobby (see above for options)
    mode: TMode,
    //Duration of the matches (See above for options). Better saved as string and only convert to number when the match starts
    duration: TDuration,
    //Current round. Important for pairings in tournaments, and allows the same people to start a new game from the same lobby, keeping track of how many games they played
    round: number, //Def: 1
    //The users present in the lobby. 
    users: TLobbyUser[] //Def: [host]
}