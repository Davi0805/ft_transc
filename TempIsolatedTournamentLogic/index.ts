import { TournamentService } from "./TournamentService.js";

const tournament = new TournamentService();

for (let i = 0; i < 10; i++) {
    tournament.registerPlayer(i, Math.floor(Math.random() * 1500 + 1000))
}