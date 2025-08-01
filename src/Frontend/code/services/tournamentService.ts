export type TPairing = {
    board: number,
    players: [number, number],
    result: number | null //points of player1
}

class TournamentService {

    loadPairings(pairings: [number, number][]) {
        for (let i = 0; i < pairings.length; i++) {
            this._pairings.push({
                board: i,
                players: pairings[i],
                result: null
            })
        }
    }


    private _pairings: TPairing[] = []
    get pairings() { return this._pairings}
}

export const tournamentService = new TournamentService()