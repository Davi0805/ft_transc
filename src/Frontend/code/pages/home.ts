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
                   <a href="/play" class="play-button inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-3xl font-semibold text-white transition-all hover:scale-105 hover:text-[#fca17d] active:scale-95">
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
                        <td class="leaderboard-td-position text-yellow-400">1</td>
                        <td class="leaderboard-td-name">Artur</td>
                        <td class="leaderboard-td-points">1247</td>
                        <td class="leaderboard-td-win">89</td>
                        <td class="leaderboard-td-losses">12</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position text-white/50">2</td>
                        <td class="leaderboard-td-name">Miguel</td>
                        <td class="leaderboard-td-points">1156</td>
                        <td class="leaderboard-td-win">76</td>
                        <td class="leaderboard-td-losses">18</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position text-orange-400">3</td>
                        <td class="leaderboard-td-name">Toni</td>
                        <td class="leaderboard-td-points">1089</td>
                        <td class="leaderboard-td-win">71</td>
                        <td class="leaderboard-td-losses">23</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position">4</td>
                        <td class="leaderboard-td-name">Mica</td>
                        <td class="leaderboard-td-points">967</td>
                        <td class="leaderboard-td-win">65</td>
                        <td class="leaderboard-td-losses">28</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position">5</td>
                        <td class="leaderboard-td-name">João</td>
                        <td class="leaderboard-td-points">834</td>
                        <td class="leaderboard-td-win">58</td>
                        <td class="leaderboard-td-losses">31</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position">6</td>
                        <td class="leaderboard-td-name">Maria</td>
                        <td class="leaderboard-td-points">712</td>
                        <td class="leaderboard-td-win">45</td>
                        <td class="leaderboard-td-losses">27</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position">7</td>
                        <td class="leaderboard-td-name">Sandrinho</td>
                        <td class="leaderboard-td-points">689</td>
                        <td class="leaderboard-td-win">42</td>
                        <td class="leaderboard-td-losses">35</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position">8</td>
                        <td class="leaderboard-td-name">Davi</td>
                        <td class="leaderboard-td-points">567</td>
                        <td class="leaderboard-td-win">38</td>
                        <td class="leaderboard-td-losses">29</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position">9</td>
                        <td class="leaderboard-td-name">Macaco</td>
                        <td class="leaderboard-td-points">456</td>
                        <td class="leaderboard-td-win">33</td>
                        <td class="leaderboard-td-losses">41</td>
                        </tr>
                        <tr class="leaderboard-tr">
                        <td class="leaderboard-td-position">10</td>
                        <td class="leaderboard-td-name">Kelson</td>
                        <td class="leaderboard-td-points">389</td>
                        <td class="leaderboard-td-win">28</td>
                        <td class="leaderboard-td-losses">37</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>

            <!-- Player Search -->
            <div class="mt-6 flex justify-center">
                <div class="relative w-full max-w-md">
                    <input type="text" placeholder="Search for a player..." class="w-full rounded-xl border border-blue-400/30 bg-slate-700/50 px-4 py-3 pr-32 pl-12 text-white placeholder-blue-200/60 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none" />
                    <svg class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-blue-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <button class="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">Search</button>
                </div>
            </div>
        </div>
    </div>
        `;
  },

  init() {
    console.log("Home page loaded!");
  },
} as const;
