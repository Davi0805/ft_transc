import { authService } from "../../services/authService"

export const SettingsPage = {
  template() {
    const nickname = authService.userNick;
    const username = authService.userUsername;
    const avatar = authService.userAvatar;

    return `
                  <div id="settings-wrapper" class="flex rounded-xl bg-gradient-to-b from-blue-500 to-neutral-900 shadow-2xl shadow-black border-y border-black text-white">
                    <!-- SIDEBAR -->
                    <div id="settings-sidebar" class="relative flex w-50 flex-col items-center border-white/20 pt-4 text-white">
                      <!-- INFO USER -->
                      <div class="user flex flex-col items-center">
                        <img class="user-avatar mb-2 h-16 w-16 rounded-full border-2 border-sky-300" src="${avatar}" alt="User avatar" />
                        <div class="user-data text-center text-base">
                          <p class="user-name font-bold">${nickname}</p>
                          <p class="user-username text-gray-400">${username}</p>
                        </div>
                      </div>

                      <!-- NAVBAR -->
                      <div class="navbar mt-4 w-full text-center">
                        <button id="settings-account" class="active transition- w-full rounded-sm border-t border-white/20 py-2 font-bold brightness-85 duration-300 ease-in-out hover:bg-gray-500/70 hover:brightness-100">Account</button>
                        <button id="settings-security" class="w-full rounded-sm border-t border-white/20 py-2 font-bold brightness-85 transition-all duration-300 ease-in-out hover:bg-gray-500/70 hover:brightness-100">Security</button>
                        <button id="settings-social" class="w-full rounded-sm border-y border-white/20 py-2 font-bold brightness-85 transition-all duration-300 ease-in-out hover:bg-gray-500/70 hover:brightness-100">Social</button>
                      </div>

                      <!-- LOGOUT -->
                      <div class="mt-auto w-full">
                        <button class="logout w-full rounded-sm border-t border-white/20 py-2 brightness-85 transition-all duration-200 ease-in hover:bg-red-500/70 hover:brightness-100">Log Out</button>
                      </div>
                    </div>

                    <!-- Settings body -->
                    <div id="settings-content" class="relative flex flex-1 flex-col p-8 text-white">
                      ${SettingsPage.getAccountHTML()}
                    </div>
                  </div>
    `;
  },

  getAccountHTML(): string {
    const username = authService.userUsername;
    const nickname = authService.userNick;
    const email = authService.userEmail;

    // <div class="settings-wrapper flex bg-gradient-to-b from-blue-500 to-neutral-900">
          return `
                    <!-- Content shadow -->
                    <div class="pointer-events-none absolute top-0 left-0 h-full w-2 bg-gradient-to-r from-black/10 to-transparent"></div>

                    <h1 class="mb-6 text-4xl font-bold">Settings</h1>
                    <h2 class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">Account</h2>

                    <div class="info flex-1 space-y-6">
                      <!-- Username -->
                      <div class="username flex items-center space-x-3">
                        <label for="username" class="w-20 font-semibold">Username:</label>
                        <input id="username" type="text" value="${username}" disabled readonly class="h-11 cursor-not-allowed rounded-3xl border-2 border-white/20 bg-black/20 px-[20px] py-[20px] pr-[45px] text-base font-medium text-white caret-white opacity-60 outline-none" />
                        <span class="text-sm text-gray-400">🔒</span>
                      </div>

                      <!-- Name -->
                      <div class="name flex items-center space-x-3">
                        <label for="name" class="w-20 font-semibold">Name:</label>
                        <input id="name" type="text" value="${nickname}" class="h-11 rounded-3xl border-2 border-white/20 bg-white px-[20px] py-[20px] pr-[45px] text-base font-medium text-black caret-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300  transition-all duration-200 ease-in" />
                        <span class="edit transition-colors duration-200 hover:text-blue-300" title="Edit">✎</span>
                      </div>

                      <!-- Email -->
                      <div class="email flex items-center space-x-3">
                        <label for="email" class="w-20 font-semibold">Email:</label>
                        <input id="email" type="email" value="${email}" class="h-11 rounded-3xl border-2 border-white/20 bg-white px-[20px] py-[20px] pr-[45px] text-base font-medium text-black caret-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300  transition-all duration-200 ease-in" />
                        <button class="edit transition-colors duration-200 hover:text-blue-300" title="Edit">✎</button>
                      </div>
                    </div>

                    <!-- Save Button positioned at bottom right -->
                    <div id="save-btn" class="mt-auto flex justify-end pt-6">
                      <button class="transform rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-all duration-100 hover:bg-blue-700 active:scale-85">Save</button>
                    </div>
                  `;
  },

  getSecurityHTML(): string  {
    return `
    
    `;
  },

  getSocialHTML(): string {
    return `
    
    `;
  },

  currentSection: "account" as "account" | "security" | "social",

  setCurretSection(section: "account" | "security" | "social"): void {
    if (SettingsPage.currentSection === section) return;
  
    SettingsPage.currentSection = section;
    SettingsPage.updateContent();
  },
  
  updateContent(): void {
    const content = document.getElementById("settings-content");
    if (!content) return;
  
    switch (SettingsPage.currentSection) {
      case "account":
        content.innerHTML = SettingsPage.getAccountHTML();
        SettingsPage.initAccountEvents();
        break;
      case "security":
        content.innerHTML = SettingsPage.getSecurityHTML();
        SettingsPage.initSecurityEvents();
        break;
      case "social":
        content.innerHTML = SettingsPage.getSocialHTML();
        SettingsPage.initSocialEvents();
        break;
    }
  },

  initAccountEvents(): void {
    const saveBtn = document.getElementById('save-btn');
    if (!saveBtn) return ;

    saveBtn.addEventListener('click', (event) => {
      console.log("DEBUG: Save click");
        // todo add save method here!!!!!!!!!!!!!!!!!!!!
        // this check if the username and email are different from the input value and if they are update them on the backend
        // then will update the sidebar name if it changed and the inputs accordingly
        // add an error message in case of failure
    });
  },

  initSecurityEvents(): void {

  },

  initSocialEvents(): void {

  },

  init(): void {
    SettingsPage.initAccountEvents();

    // Event listener delegations
    const container = document.getElementById("settings-sidebar");

    if (container) {
      container.addEventListener('click', (event :MouseEvent) => {
        const target = event.target as HTMLElement;

        if (target.matches("#settings-account")) {
          SettingsPage.setCurretSection("account");
        } else if (target.matches("#settings-security")) {
          SettingsPage.setCurretSection("security");
        } else if (target.matches("#settings-social")) {
          SettingsPage.setCurretSection("social");
        }
      });
    }

    // update profile picture event listener on avatar
  },

};
