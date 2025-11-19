import { getUserAvatarById } from "../../api/userData/getUserAvatarAPI";
import { UserData } from "../../api/userData/types/UserDataType";
import { ErrorPopup } from "../../utils/popUpError";
import { ProfileDataType } from "../../api/userData/types/ProfileDataType";
import { authService } from "../../services/authService";
import { PlayerStatistics } from "../../api/userData/types/PlayerStatisticsType";
import { getStatisticsById } from "../../api/userData/getUserStatisticsAPI";
import { getMatchHistoryById } from "../../api/userData/getMatchHistoryByUsernameAPI";
import { MatchHistoryEntry } from "../../api/userData/types/MatchHistoryType";


export const ProfilePage = {
  template() {
    return `
     <div class="w-full max-w-4xl h-auto bg-gradient-to-b from-blue-500 via-blue-800 to-neutral-900 rounded-xl shadow-2xl border-t border-black/30 border-b text-white p-8 flex flex-col gap-6">
        
        <!-- Profile Header -->
        <div class="flex gap-6 items-start">
            <!-- Avatar Section -->
            <div class="flex flex-col items-center gap-4">
                <img id="profile-avatar"
                     src="" 
                     alt="User Avatar" 
                     class="w-32 h-32 rounded-full border-3 border-sky-500 object-cover" 
                     width="128px height="128px">
            </div>
            
            <!-- User Info -->
            <div class="flex-1 flex gap-6 items-center justify-center pl-2 h-32">
                <!-- User Details -->
                <div class="flex flex-col flex-1 gap-2 justify-center h-full">
                    <!-- clip text to create gradient effect -->
                    <h1 id="profile-nickname" class="text-4xl leading-none font-bold text-white "></h1>
                    <p id="profile-username" class="text-lg leading-none text-slate-300 font-medium"></p>
                    <p class="text-gray-300 text-base leading-none font-semibold">
                        Friends <span id="profile-friends" class="text-sky-500 font-semibold pl-2"></span>
                    </p>
                </div>
                
                <!-- Ranking Section -->
                <div class="flex flex-col items-center h-[90px] justify-center min-w-[120px] bg-black/20 rounded-xl border border-white/10">
                    <div id="profile-ranking" class="text-3xl font-bold text-amber-400 mb-1"></div>
                    <div class="text-sm text-gray-400 uppercase tracking-wider">Ranking</div>
                </div>
            </div>
        </div>

        <!-- Content Section -->
        <div class="flex-1 flex flex-col gap-8">
            <!-- Statistics -->
            <div class="flex flex-col gap-5">
                <h2 class="text-2xl font-bold mb-2 border-b border-white/20 pb-2">Statistics</h2>
                
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center p-3 bg-black/20 rounded-lg border border-white/10">
                        <div id="profile-wins" class="text-2xl font-bold text-emerald-400 mb-1">5</div>
                        <div class="text-sm text-gray-400">Wins</div>
                    </div>
                    
                    <div class="text-center p-3 bg-black/20 rounded-lg border border-white/10">
                        <div id="profile-losses" class="text-2xl font-bold text-red-400 mb-1">5</div>
                        <div class="text-sm text-gray-400">Losses</div>
                    </div>
                    
                    <div class="text-center p-3 bg-black/20 rounded-lg border border-white/10">
                        <div id="profile-wr" class="text-2xl font-bold text-emerald-400 mb-1">50</div>
                        <div class="text-sm text-gray-400">Winrate</div>
                    </div>
                    
                    <div class="text-center p-3 bg-black/20 rounded-lg border border-white/10">
                        <div id="profile-tournwins" class="text-2xl font-bold text-amber-400 mb-1">3</div>
                        <div class="text-sm text-gray-400">Tournament Wins</div>
                    </div>
                </div>
            </div>

            <!-- Match History -->
            <div class="mt-2">
                <h2 class="mb-5 pb-2 text-2xl font-bold border-b border-white/20">Match History</h2>
                
                <div class="w-full rounded-xl border border-blue-500/20 overflow-hidden">
                    <table class="w-full border-separate bg-slate-600/50 min-w-full ">
                        <thead class="bg-black/20">
                            <tr>
                                <th class="px-3 py-3 text-center font-semibold text-blue-300 text-sm border-b border-blue-500/30 w-[33%]">
                                    Game Mode
                                </th>
                                <th class="px-3 py-3 text-center font-semibold text-blue-300 text-sm border-b border-blue-500/30 w-[33%]">
                                    Result
                                </th>
                                <th class="px-3 py-3 text-center font-semibold text-blue-300 text-sm border-b border-blue-500/30 w-[33%]">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="hover:bg-blue-500/10 transition-colors duration-200">
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate">2v2</td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center text-emerald-400 font-semibold truncate">Win</td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate">Date</td>
                            </tr>
                            <tr class="hover:bg-blue-500/10 transition-colors duration-200">
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate"></td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center text-emerald-400 font-semibold truncate"></td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate"></td>
                            </tr>
                            <tr class="hover:bg-blue-500/10 transition-colors duration-200">
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate"></td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center text-emerald-400 font-semibold truncate"></td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate"></td>
                            </tr>
                            <tr class="hover:bg-blue-500/10 transition-colors duration-200">
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate"></td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center text-emerald-400 font-semibold truncate"></td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate"></td>
                            </tr>
                            <tr class="hover:bg-blue-500/10 transition-colors duration-200">
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate"></td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center text-emerald-400 font-semibold truncate"></td>
                                <td class="px-3 py-3 h-[49px] border-b border-blue-500/10 text-center truncate"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


          `;
  },

  async init(userData: ProfileDataType) {
    console.log("Profile page loaded!");

    // Load user data into the page contents
    // profile-avatar 
    const avatarElement = document.getElementById("profile-avatar") as HTMLImageElement;
    try {
        avatarElement.src = await getUserAvatarById(userData.user_id);
    } catch (error) {
        console.error("DEBUG: Failed to load user avatar:", error);
        const errorPopup = new ErrorPopup();
        errorPopup.create("Failed to load user avatar", "Looks like there was an issue getting this user avatar. Please refresh and try again.");
        avatarElement.src = "./Assets/default.png"; // Fallback image
    }

    // profile-nickname 
    const nicknameElement = document.getElementById("profile-nickname") as HTMLHeadingElement;
    nicknameElement.textContent = userData.nickname || "Bob Esponja";

    // profile-username
    const usernameElement = document.getElementById("profile-username") as HTMLParagraphElement;
    usernameElement.textContent = userData.username || "Bob Esponja";

    // profile-friends
    const friendsElement = document.getElementById("profile-friends") as HTMLSpanElement;
    friendsElement.textContent = userData.friendsCount.toString() || "NA";
    
    // profile-ranking
    const rankingElement = document.getElementById("profile-ranking") as HTMLDivElement;
    rankingElement.textContent = userData.ranking.toString() || "NA";


    // Statistics Section
    let statistics: PlayerStatistics | undefined;
    try {
        statistics = await getStatisticsById(userData.user_id);
    } catch (error) {
        console.error("DEBUG: Failed to load player statistics:", error);
        const errorPopup = new ErrorPopup();
        errorPopup.create("Failed to load player statistics", "Looks like there was an issue getting this user statistics. Please refresh and try again.");
    }

    // profile-wins
    const winsElement = document.getElementById("profile-wins") as HTMLDivElement;
    winsElement.textContent = statistics?.wins.toString() || "NA";

    // profile-losses
    const lossesElement = document.getElementById("profile-losses") as HTMLDivElement;
    lossesElement.textContent = statistics?.losses.toString() || "NA";

    // profile-wr
    const winrateElement = document.getElementById("profile-wr") as HTMLDivElement;
    if (!statistics) 
        winrateElement.textContent = "NA";
    else if (statistics.wins + statistics.losses === 0) {
        winrateElement.textContent = "100%";
    } else {
        const winrate = (statistics.wins / (statistics.wins + statistics.losses) * 100).toFixed(2);
        winrateElement.textContent = `${winrate}%`;
        winrateElement.classList.add((typeof winrate === "number" && winrate < 50) ? "text-red-400" : "text-emerald-400");
    }


    // profile-tournwins  
    const tournwinsElement = document.getElementById("profile-tournwins") as HTMLDivElement;
    tournwinsElement.textContent = statistics?.tournamentsWon.toString() || "NA";

    // load match history
    let matchHistory: MatchHistoryEntry[] = [];
    try {
        matchHistory = await getMatchHistoryById(userData.user_id);
    } catch (error) {
        console.error("DEBUG: Failed to load match history:", error);
        const errorPopup = new ErrorPopup();
        errorPopup.create("Failed to load match history", "Looks like there was an issue getting this user match history. Please refresh and try again.");
    }

    const tableBody = document.querySelector("table tbody") as HTMLTableSectionElement;
    if (tableBody) {
        const rows = tableBody.querySelectorAll("tr");

        matchHistory.forEach((entry, index) => {
            const cells = rows[index].querySelectorAll("td");
            
            // game
            const gameElement = cells[0] as HTMLTableCellElement;
            gameElement.textContent = matchHistory[index].mode || "";

            // result
            const resultElement = cells[1] as HTMLTableCellElement;
            const result = matchHistory[index].result || "";
            resultElement.textContent = result.charAt(0).toUpperCase() + result.slice(1); // Capitalize first letter
            if (result === "Won") {
                resultElement.classList.add("text-emerald-400");
                resultElement.classList.remove("text-red-400");
            } else if (result === "Lost") {
                resultElement.classList.add("text-red-400");
                resultElement.classList.remove("text-emerald-400");
            }

            // date
            const dateElement = cells[2] as HTMLTableCellElement;
            dateElement.textContent = matchHistory[index].date_time || "";
        })
    }
},


} as const;
