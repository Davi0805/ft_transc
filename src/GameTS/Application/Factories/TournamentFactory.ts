import { TournamentMatchT } from "../Services/TournamentService.js";
import { MatchSettingsT } from "./MatchFactory.js";

export type TournamentParticipantT = {
    id: number,
    nick: string,
    spriteID: number,
    score: number,
    rating: number,
    prevOpponents: number[],
    teamDist: number,
    participating: boolean
}

export type TournamentT = {
    id: number,
    lobbyID: number,
    matchSettings: MatchSettingsT, 
    participants: TournamentParticipantT[]
    rounds: {
        roundNo: number,
        matches: {
            matchID: number,
            playerIDs: [number, number],
            winnerID: number | null
        }[]
    }[],
    currentRound: number
}

export type ClientTournamentT = {
    currentRound: number,
    currentPairings: [number, number][] //In case there are no pairings yet for the next round
    participants: TournamentParticipantT[]
}

class TournamentFactory {
    create(lobbyID: number, matchSettings: MatchSettingsT, participants: TournamentParticipantT[]): TournamentT {
        return {
            id: this._currentID++,
            lobbyID: lobbyID,
            matchSettings: matchSettings,
            participants: participants,
            rounds: [],
            currentRound: 0
        }
    }

    private _currentID: number = 0;
}

const tournamentFactory = new TournamentFactory()
export default tournamentFactory;