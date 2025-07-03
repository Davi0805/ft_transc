import { TournamentService } from "./TournamentService.js";
import { Player } from "./TournamentService.js";

const tournament = new TournamentService();

const players: Player[] = []

const scores = [
    1, 0, 1, 1, 0, 1, 0, 0
]

const teamDists = [
    -1, -1, +1, -1, +1, +1, -1, +1
]

for (let i = 0; i < 8; i++) {
    players.push({
        id: i + 1,
        score: scores[i],
        rating: 2200 - (i * 100),
        prevOpponents: [],
        teamDist: teamDists[i]
    })
}




/* const normalizedPlayers = Array.from(players).sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    else return b.rating - a.rating;
});
console.log(normalizedPlayers)
let playerRank = 1;
normalizedPlayers.forEach(player => { player.rating = playerRank++; })
console.log(normalizedPlayers[0], normalizedPlayers[4])
console.log(tournament._calculateEdgeWeight(normalizedPlayers[0], normalizedPlayers[4], 4)) */


const pairings = tournament.getNextRoundPairings(players);

console.log(pairings)