"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TournamentService_js_1 = require("./TournamentService.js");
const tournament = new TournamentService_js_1.TournamentService();
for (let i = 0; i < 10; i++) {
    tournament.registerPlayer(i, Math.floor(Math.random() * 1500 + 1000));
}
