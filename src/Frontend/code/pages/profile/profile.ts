export const ProfilePage = {
  template() {
    return `
      <div class="profile-page-container">
        <!-- Profile Header -->
        <div class="profile-header">
            <div class="avatar-section">
                <div class="avatar">avatar</div>
            </div>
            
            <div class="user-info">
                <div class="user-details">
                    <h1 class="display-name">display name</h1>
                    <p class="username">username</p>
                    <p class="friends-info">Friends <span class="friends-count-inline">21</span></p>
                    
                    <div class="action-buttons">
                        <button class="btn btn-primary">add friend</button>
                        <button class="btn btn-secondary">Block</button>
                    </div>
                </div>
                
                <div class="elo-section">
                    <div class="elo-value">1847</div>
                    <div class="elo-label">ELO</div>
                </div>
            </div>
        </div>

        <!-- Content Section -->
        <div class="content-section">
            <!-- Statistics -->
            <div class="stats-section">
                <h2 class="section-title">Statistics</h2>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">49</span>
                        <span class="stat-label">Wins</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-value">0</span>
                        <span class="stat-label">Losses</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-value winrate">100.00%</span>
                        <span class="stat-label">Winrate</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-value">3</span>
                        <span class="stat-label">Tournament Wins</span>
                    </div>
                </div>
            </div>

            <!-- Match History -->
            <div class="match-history-section">
                <h2 class="section-title">Match History</h2>
                
                <table class="match-history-table">
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Map</th>
                            <th>Mode</th>
                            <th>Result</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2v2</td>
                            <td>2v2 LARGE</td>
                            <td>Ranked</td>
                            <td class="result-victory">Victory!</td>
                            <td>12-01-2025</td>
                        </tr>
                        <tr>
                            <td>2v2</td>
                            <td>2v2 LARGE</td>
                            <td>Ranked</td>
                            <td class="result-victory">Victory!</td>
                            <td>12-01-2025</td>
                        </tr>
                        <tr>
                            <td>2v2</td>
                            <td>2v2 LARGE</td>
                            <td>Ranked</td>
                            <td class="result-victory">Victory!</td>
                            <td>12-01-2025</td>
                        </tr>
                        <tr>
                            <td>2v2</td>
                            <td>2v2 LARGE</td>
                            <td>Ranked</td>
                            <td class="result-victory">Victory!</td>
                            <td>12-01-2025</td>
                        </tr>
                        <tr>
                            <td>2v2</td>
                            <td>2v2 LARGE</td>
                            <td>Ranked</td>
                            <td class="result-defeat">Defeat</td>
                            <td>12-01-2025</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>


          `;
  },

  init() {
    console.log("Profile page loaded!");
  },
} as const;
