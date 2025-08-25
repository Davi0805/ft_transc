import { TMatchResult } from "./game/ServerGame.js"
import { CGameDTO, SGameDTO } from "./game/shared/dtos.js"
import { CAppConfigs } from "./game/shared/SetupDependencies.js"
import { SIDES } from "./game/shared/sharedTypes.js"
import { FriendlyPlayerT, LobbyT, LobbyUserT, RankedPlayerT } from "./Repositories/LobbyRepository.js"
import { MatchSettingsT } from "./Repositories/MatchRepository.js"
import { TournamentParticipantT } from "./Repositories/TournamentRepository.js"
import { TournamentMatchT } from "./services/TournamentService.js"

export type InboundDTOMap = {
    updateSettings: {
        settings: MatchSettingsT,
    },

    inviteUserToLobby: {
        userID: number
    },

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

    start: null

    updateGame: CGameDTO
}

export type OutboundDTOMap = {
    lobby: LobbyT,
    addLobbyUser: {
        user: LobbyUserT
    },

    updateSettings: {
        settings: MatchSettingsT,
        users: LobbyUserT[] | null
    },

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

    startMatch: {
        configs: CAppConfigs
    }

    displaySettings: {
        standings: TournamentParticipantT[]
    }

    displayPairings: {
        pairings: TournamentMatchT[]
    }

    updateTournamentResult: {
        matchID: number,
        winnerID: number
    }

    displayResults: null

    displayTournamentEnd: {
        standings: TournamentParticipantT[]
    }

    updateGame: SGameDTO,

    endOfMatch: {
        result: TMatchResult
    }

    returnToLobby: {
        lobby: LobbyT
    }

    actionBlock: {
        blockType: string
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