import { ErrorPopup } from "../utils/popUpError";
import { PlayerStats } from "../api/leaderboard/types/PlayerStatsInterface";
import { getLeaderboard } from "../api/leaderboard/getTopTenAPI";
import { debounce } from "../utils/debouncing";
import { TopTenPlayers } from "../api/leaderboard/types/TopTenPlayers";
import { UsersData } from "../api/leaderboard/types/usersDataInterface";
import { getTopTenData } from "../api/leaderboard/getTopTenDataAPI";
import DOMPurify from "dompurify";

export const HomePage = {
  template() {
    return `
    <div class="content mx-auto w-full max-w-6xl">
        <!-- Hero Section -->
        <div class="grid items-center gap-8 xl:grid-cols-2">
            <!-- Game Demo Area -->
            <div class="game-demo relative flex h-80 items-center justify-center overflow-hidden rounded-xl p-6">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900/20"></div>
                <div class="relative z-10 text-center">
                    <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
                        <svg class="h-10 w-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-blue-200">Game Demo</h3>
                </div>
            </div>

            <!-- Content Area -->
            <div class="space-y-6">
                <div class="text-center">
                    <h1 class="mb-4 text-3xl font-bold break-words sm:text-4xl md:text-5xl">ft_transcendence</h1>
                    <p class="mb-8 text-xl leading-relaxed text-blue-100/90">Dive into the ultimate gaming experience where skill meets innovation. Challenge players worldwide in our revolutionary multiplayer platform that pushes the boundaries of competitive gaming.</p>
                </div>

                <!-- Call to Action -->
                <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                   <a href="/play" data-link class="play-button inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-3xl font-semibold text-white transition-all hover:scale-105 hover:text-[#fca17d] active:scale-95">
                   <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Now
                    </a>

                    <div class="flex items-center justify-center gap-6 text-blue-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-white">3+</div>
                            <div class="text-sm opacity-80">Active Players</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-white">24/7</div>
                            <div class="text-sm opacity-80">Online Gaming</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Features Preview -->
        <div class="mt-12 grid grid-cols-3 gap-6 border-t border-blue-300/20 pt-8">
            <div class="p-4 text-center">
                <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                    <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 class="mb-2 font-semibold text-blue-100">Lightning Fast</h3>
                <p class="text-sm text-blue-200/70">No crazy loading times</p>
            </div>

            <div class="p-4 text-center">
                <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                    <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h3 class="mb-2 font-semibold text-blue-100">Multiplayer</h3>
                <p class="text-sm text-blue-200/70">Connect, chat and play with friends</p>
            </div>

            <div class="p-4 text-center">
                <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                    <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 class="mb-2 font-semibold text-blue-100">Secure</h3>
                <p class="text-sm text-blue-200/70">We are not data farming</p>
            </div>
        </div>

        <!-- Leaderboard Section -->
        <div class="mt-16 border-t border-blue-300/20 pt-8">
            <h2 class="mb-8 text-center text-3xl font-bold">Leaderboard</h2>

            <div class="rounded-xl border border-blue-400/20 bg-slate-700/50 p-6">
                <div class="overflow-x-auto">
                    <table class="w-full">
                    <thead>
                        <tr class="border-b border-blue-400/30">
                        <th class="px-4 py-3 text-left font-semibold text-blue-200">Position</th>
                        <th class="px-4 py-3 text-left font-semibold text-blue-200">Name</th>
                        <th class="px-4 py-3 text-center font-semibold text-blue-200">Points</th>
                        <th class="px-4 py-3 text-center font-semibold text-blue-200">Wins</th>
                        <th class="px-4 py-3 text-center font-semibold text-blue-200">Losses</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position text-yellow-400"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position text-white/50"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position text-orange-400"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position"></td>
                        <td class="leaderboard-td-name"></td>
                        <td class="leaderboard-td-points"></td>
                        <td class="leaderboard-td-win"></td>
                        <td class="leaderboard-td-losses"></td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>

            <!-- Player Search -->
            <!--
            <div class="mt-6 flex justify-center">
                <div class="relative w-full max-w-md">
                    <input id="search-player" type="text" placeholder="Search for a player..." class="w-full rounded-xl border border-blue-400/30 bg-slate-700/50 py-3 px-4 pl-12 text-white placeholder-blue-200/60 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none" />
                    <svg class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-blue-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div> -->
        </div>
    </div>
        `;
  },

  async getTopTen(): Promise<PlayerStats[]> {
    let PlayerStatsList: PlayerStats[] = [];
    try {
      const topTen: TopTenPlayers[] = await getLeaderboard();

      const userIds: number[] = topTen.map(player => player.user_id);

      const usersData: UsersData[] = await getTopTenData(userIds)

      usersData.forEach((user, index) => {
        PlayerStatsList.push({
          id: user.user_id,
          username: user.username,
          points: user.rating,
          rank: index + 1,
          wins: topTen.find(player => player.user_id === user.user_id)?.wins || 0,
          losses: topTen.find(player => player.user_id === user.user_id)?.losses || 0,
        });
      });

      return PlayerStatsList;
      
    } catch (error) {
      console.error("DEBUG:Error fetching leaderboard:", error);
      throw error;
    }
  },

  async loadLeaderBoard() {
    const leaderboardRows = document.querySelectorAll('.leaderboard-tr');
    try {
        if (!leaderboardRows) {
          throw new Error("Someone is messing up the html caralho ta quieto");
        }

        const topTen: PlayerStats[] = await this.getTopTen();

        
        leaderboardRows.forEach((row, index) => {
          const positionCell = row.querySelector('.leaderboard-td-position');
          const nameCell = row.querySelector('.leaderboard-td-name');
          const pointsCell = row.querySelector('.leaderboard-td-points');
          const winCell = row.querySelector('.leaderboard-td-win');
          const lossesCell = row.querySelector('.leaderboard-td-losses');
    
          if (!positionCell || !nameCell || !pointsCell || !winCell || !lossesCell) {
            const errorPopup = new ErrorPopup();
            errorPopup.create("Error Loading Leaderboard", "One or more cells are missing in the leaderboard row.");
            return;
          }
    
          if (topTen.length > index) {
            const playerData = topTen[index];
            positionCell.textContent = (index + 1).toString();
            if (index === 0) {
              // This is for when the leaderboard is loaded after a search
              // i wont use toggle cuz im afraid it might break in some error case but 
              // if anyone is willing you could test it kkkk
              positionCell.classList.remove('text-blue-200');
              positionCell.classList.add('text-yellow-400');
            }
            nameCell.innerHTML = DOMPurify.sanitize(`<a href='/profile/${playerData.id}' class="hover:text-[#fca17d] transition-all duration-150 ease-in-out" data-link>${playerData.username}</a>`);
            pointsCell.textContent = playerData.points.toString();
            winCell.textContent = playerData.wins.toString();
            lossesCell.textContent = playerData.losses.toString();
          }
        });
    } catch (error) {
        const errorPopup = new ErrorPopup();
        errorPopup.create("Error Loading Leaderboard", "Failed to fetch the top ten players. Please try again later.");
        console.error("DEBUG:Error fetching top ten players:", error);
    }
  },

  updateLeaderBoard(playerData: PlayerStats | null): void{
    // clear leader board contents
    // erases positions as well!
    const leaderboardRows = document.querySelectorAll('.leaderboard-tr');
    try {
        if (!leaderboardRows) {
          throw new Error("Someone is messing up the html caralho ta quieto");
        }
        if (!playerData){
          throw new Error("Searched player error");
        }

        leaderboardRows.forEach((row, index) => {
          const positionCell = row.querySelector('.leaderboard-td-position');
          const nameCell = row.querySelector('.leaderboard-td-name');
          const pointsCell = row.querySelector('.leaderboard-td-points');
          const winCell = row.querySelector('.leaderboard-td-win');
          const lossesCell = row.querySelector('.leaderboard-td-losses');
    
          if (!positionCell || !nameCell || !pointsCell || !winCell || !lossesCell) {
            const errorPopup = new ErrorPopup();
            errorPopup.create("Error Loading Leaderboard", "One or more cells are missing in the leaderboard row.");
            return;
          }
    
          // fill first row with playerData
          // if player is on podium select correct color for position
          if (index === 0) {
            positionCell.textContent = playerData.rank?.toString() || 'NA';

            // rank color lol
            positionCell.classList.remove('text-yellow-400', 'text-white/50', 'text-orange-400', 'text-blue-200');
            switch (playerData.rank) {
              case 1:
                positionCell.classList.add('text-yellow-400');
                break;
              case 2:
                positionCell.classList.add('text-white/50');
                break;
              case 3:
                positionCell.classList.add('text-orange-400');
                break;
              default:
                positionCell.classList.add('text-blue-200');
                break;
            }

            nameCell.textContent = playerData.username;
            pointsCell.textContent = playerData.points.toString();
            winCell.textContent = playerData.wins.toString();
            lossesCell.textContent = playerData.losses.toString();
          } else {
            positionCell.textContent = '';
            nameCell.textContent = '';
            pointsCell.textContent = '';
            winCell.textContent = '';
            lossesCell.textContent = '';
          }
        });
    } catch (error) {
        const errorPopup = new ErrorPopup();
        errorPopup.create("Error Loading Leaderboard", "Failed to fetch the top ten players. Please try again later.");
        console.error("DEBUG:Error fetching top ten players:", error);
    }

  },

  async initLeaderboardSearch(): Promise<void>{
    const input = document.getElementById("search-player");
    if (!input ||
        !(input instanceof HTMLInputElement)) {
      const errorPopup = new ErrorPopup();
      errorPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly. Please refresh and try again."
      );
      return;
    }

    // initialization for for error case
    let errorShown = false;
    let errorTimer: ReturnType<typeof setTimeout> | null = null;

    input.addEventListener("input", async (event) => {
      event.preventDefault();

      // makes it so it doesnt call on every single input but with a delay
      const inputDebounced = debounce(async () => {

        const playerUsername: string = input.value.trim();
        if (!playerUsername.length) {
          await this.loadLeaderBoard();
          return; 
        }
        
        try {
          // 200 com dados do jogador
          // 200 com null se o jogador não existir
          //! todo delete mock data
          // const playerData: PlayerStats | null = await searchPlayer(playerUserame);
          const playerData: PlayerStats | null = {
            id: 1, // userID
            username: "artur lindo",
            rank: 15, // Rank of the player in the leaderboar
            wins: 69,
            losses: 420,
            points: 666, // Points of the player in the leaderboard
          };

          // Display player data
          this.updateLeaderBoard(playerData);
        } catch (error) {
          // Show error
          if (!errorShown) {
            const errPopup = new ErrorPopup();
            errPopup.create("Error Searching Player!", "Seems like an error occoured while searching player. Please refresh and try again");
            errorShown = true;

            errorTimer && clearTimeout(errorTimer); // short circuting guard
            // after 5000ms sets the error shown to false so it can appear again if called
            // this prevents popup spam
            errorTimer = setTimeout(() => {
              errorShown = false;
            }, 5000);
          }
        }
      }, 350); // 500ms debouncing time

      inputDebounced(); // calling
    });


  },

  init() {
    console.log("Home page loaded!");

    this.loadLeaderBoard();

    // cada nome uma anchor para o perfil do jogador no nameCell. adicionar href para o sitio correto
    // this.initLeaderboardSearch();

  },
} as const;
