import { TMatchResult } from "./game/ServerGame.js"
import { CGameDTO, SGameDTO } from "./game/shared/dtos.js"
import { CAppConfigs } from "./game/shared/SetupDependencies.js"
import { FriendlyPlayerT, LobbyT, LobbyUserT, RankedPlayerT } from "./Repositories/LobbyRepository.js"
import { MatchSettingsT } from "./Repositories/MatchRepository.js"
import { TournamentParticipantT } from "./Repositories/TournamentRepository.js"

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
    removeLobbyUser: {
        userID: number
    }

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

    startTournament: null // No need (for now) to send anything

    displayStandings: {
        standings: TournamentParticipantT[]
    }

    displayPairings: {
        pairings: [number, number][]
    }

    updateTournamentResult: {
        matchIndex: number, //basically board, but called index because it starts in 0
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