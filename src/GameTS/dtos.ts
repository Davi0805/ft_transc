import type { FriendlyPlayerT, LobbyT, LobbyUserT, RankedPlayerT } from "./Application/Factories/LobbyFactory.js"
import type { MatchSettingsT } from "./Application/Factories/MatchFactory.js"
import type { TMatchResult } from "./Application/game/ServerGame.js"
import type { CGameDTO, SGameDTO } from "./Application/game/shared/dtos.js"
import type { CAppConfigs } from "./Application/game/shared/SetupDependencies.js"


//These are the reasons why a server might block a client action
type ActionBlockReasonT = "setReadyWithoutJoining"
    | "notEveryoneReady"
    | "notAllSlotsFilled"
    | "fewPlayersForTournament"
    | "tooManyPlayersInTournament"

// Client sends these after...
export type InboundDTOMap = {
    //LOBBY DTOS
    //Clicking on "Apply" after choosing new settings
    updateSettings: {
        settings: MatchSettingsT,
    },

    //Clicks on "Invite"
    inviteUserToLobby: {
        userID: number
    },

    //Alters its state
    updateReadiness: {
        ready: boolean
    },
    addFriendlyPlayer: {
        player: FriendlyPlayerT
    },
    removeFriendlyPlayer: {
        playerID: number //Note: This is the id of the player, NOT the user!
    }
    addRankedPlayer: {
        player: RankedPlayerT
    }
    removeRankedPlayer: null
    addTournamentPlayer: null
    removeTournamentPlayer: null

    //Host clicks "Start" in any lobby
    start: null

    //GAME DTOS
    //clicks in any key that controls their paddle
    updateGame: CGameDTO
}


//Server sends these after...
export type OutboundDTOMap = {
    //LOBBY DTOS
    //Client joins lobby. THIS IS SENT ONLY TO CLIENT WHO JOINED FOR INITIALIZATION PURPOSES
    lobby: LobbyT,

    //Client joins lobby. THIS IS SENT TO EVERYONE BUT THE CLIENT WHO JUST JOINED
    addLobbyUser: {
        user: LobbyUserT
    },

    //Client leaves lobby, for whatever reason (either clicked on "leave", disconnected, etc.)
    removeLobbyUser: {
        userID: number
    }

    //Settings are updated
    updateSettings: {
        settings: MatchSettingsT,
        users: LobbyUserT[] | null
    },

    //Any client changes their status
    updateReadiness: {
        userID: number,
        ready: boolean
    }
    addFriendlyPlayer: {
        userID: number
        player: FriendlyPlayerT
    },
    removeFriendlyPlayer: {
        playerID: number
    }
    addRankedPlayer: {
        userID: number,
        player: RankedPlayerT
    },
    removeRankedPlayer: {
        userID: number 
    }
    addTournamentPlayer: {
        userID: number
    }
    removeTournamentPlayer: {
        userID: number
    }

    //A client does something that does not have any impact, because the conditions for that action to be valid are not met
    //Examples include: 
    actionBlock: {
        reason: ActionBlockReasonT
    }

    //It is time to return to the lobby (either because a match or a tournament is over)
    returnToLobby: {
        lobby: LobbyT
    }

    //TOURNAMENT DTOS
    //A tournament is about to start
    startTournament: null // No need (for now) to send anything

    //Standings must be displayed (and updated)
    /* displayStandings: {
        standings: TournamentParticipantT[]
    } */
    //Pairings must be displayed
    displayPairings: {
        pairings: [number, number][]
    }
    //Result of a match must be updated (but not necessarily displayed!!!!!)
    updateTournamentResult: {
        matchIndex: number, //basically board, but called index because it starts in 0
        winnerID: number
    }
    //Results must be displayed
    displayResults: null
    //End of tournament must be displayed (with final standings)
    /* displayTournamentEnd: {
        standings: TournamentParticipantT[]
    } */

    //MATCH DTOS
    //A match is about to start (Either on its own or as part of a tournament)
    startMatch: {
        configs: CAppConfigs
    }
    //Game must be updated
    updateGame: SGameDTO,
    //Game finished (either all teams but one lost, or time is over)
    endOfMatch: {
        result: TMatchResult
    }
}



export type InboundDTO = {
    [K in keyof InboundDTOMap]: {
        requestType: K,
        data: InboundDTOMap[K]
    }
}[keyof InboundDTOMap]

export type OutboundDTO<T extends keyof OutboundDTOMap = keyof OutboundDTOMap> = {
    requestType: T,
    data: OutboundDTOMap[T]
}