import { TournamentService } from "./TournamentService.js";
import { Player } from "./TournamentService.js";

const tournament = new TournamentService();

const players: Player[] = []

const scores = [
    0, 1, 1, 2, 2, 1, 2, 3
]

const teamDists = [
    -1, -1, +1, -1, +1, +1, -1, +1
]

const prevs = [
    [5, 4, 6], [6, 7, 4], [7, 6, 5], [8, 1, 2], [1, 8, 3], [2, 3, 1], [3, 2, 8], [4, 5, 7]
]

for (let i = 0; i < 8; i++) {
    players.push({
        id: i + 1,
        score: 0,
        rating: 2200 - (i * 100),
        prevOpponents: [],
        teamDist: 0
    })
}
console.log("Initial table: ", tournament.getClassificationTable(players))
for (let i = 0; i < 4; i++) {
    console.log('------------------')
    console.log(`Round ${i+1}:`)
    const pairings = tournament.getNextRoundPairings(players);
    console.log("pairings: ", pairings);

    console.log("results: ")
    pairings.forEach(match => {
        const player1 = players.find(player => player.id === match[0]);
        const player2 = players.find(player => player.id === match[1]);
        if (!player1 || !player2) {
            throw Error("loles")
        }

        const winner = Math.floor(Math.random() * 2) === 0 ? player1 : player2;
        winner.score += 1;
        console.log(`(${player1.id}) ${winner === player1 ? 1 : 0} - ${winner === player2 ? 1 : 0} (${player2.id})`)
        player1.prevOpponents.push(player2.id);
        player2.prevOpponents.push(player1.id);
        // Algo takes into account the teamDist, but the return doesn't!
    });
    const classTable = tournament.getClassificationTable(players);
    console.log("classTable")
    classTable.forEach(player => {
        console.log("id: ", player.id, "score: ", player.score);
    })
}
//console.log(tournament.getClassificationTable(players))

