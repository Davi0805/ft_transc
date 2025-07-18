import { UserData } from "../../api/getUserDataAPI";
import { authService } from "../../services/authService";
import { updateName } from "../../api/updateNameAPI";
import { updatePassword } from "../../api/updatePasswordAPI";
import { enableTwoFactor } from "../../api/enableTwoFactorAPI";
import { confirmTwoFactorCode } from "../../api/confirmEnableTwoFactorAPI"
import { uploadAvatar } from "../../api/uploadAvatarAPI"

export const SettingsPage = {
  template() {
    const nickname = authService.userNick;
    const username = authService.userUsername;
    const avatar = authService.userAvatar;

    return `
            <div id="settings-wrapper" class="relative flex w-[800px] h-[450px] rounded-xl bg-gradient-to-b from-blue-500 via-blue-800 to-neutral-900 shadow-2xl shadow-black border-y border-black text-white">
              <!-- SIDEBAR -->
              <div id="settings-sidebar" class=" flex w-52 min-w-32 flex-col items-center border-white/20 pt-4 text-white">
                <!-- INFO USER -->
                <div class="user flex flex-col items-center">
                  <!-- Profile image -->
                  <label for="avatar-upload" class="relative group cursor-pointer">
                    <img
                      id="user-avatar"
                      class="h-16 w-16 rounded-full border-2 border-sky-300 object-cover transition duration-300 group-hover:brightness-75"
                      src="${avatar}"
                      alt="User avatar"
                    />
                    <!-- Overlay -->
                    <div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                      </svg>
                    </div>
                  </label>
                  <input type="file" id="avatar-upload" class="hidden" accept="image/*" />

                  <!-- User -->
                  <div class="mt-2 text-center text-base">
                    <p id="user-name" class="font-bold">${nickname}</p>
                    <p id="user-username" class="text-gray-400">${username}</p>
                  </div>
                </div>

                <!-- NAVBAR -->
                <div class="navbar mt-4 w-full text-center">
                  <button id="settings-account" class="transition- w-full rounded-sm border-t border-white/20 py-2 font-bold brightness-85 duration-300 ease-in-out hover:bg-gray-400/60 hover:brightness-100 settings-active">Account</button>
                  <button id="settings-security" class="w-full rounded-sm border-t border-white/20 py-2 font-bold brightness-85 transition-all duration-300 ease-in-out hover:bg-gray-400/60 hover:brightness-100">Security</button>
                  <button id="settings-social" class="w-full rounded-sm border-y border-white/20 py-2 font-bold brightness-85 transition-all duration-300 ease-in-out hover:bg-gray-400/60 hover:brightness-100">Social</button>
                </div>

                <!-- LOGOUT -->
                <div class="mt-auto w-full">
                  <button id="settings-logout" class="w-full rounded-sm border-t border-white/20 py-2 brightness-85 transition-all duration-200 ease-in hover:bg-red-500/70 hover:brightness-100">Log Out</button>
                </div>
              </div>

              <!-- Content shadow -->
              <div class="pointer-events-none absolute top-0 left-52 h-full w-2 bg-gradient-to-r from-black/10 to-transparent"></div>

              <!-- Settings body -->
              <div id="settings-content" class=" flex flex-1 flex-col p-8 text-white">
                ${SettingsPage.getAccountHTML()}
              </div>
            </div>
    `;
  },

  getAccountHTML(): string {
    const username = authService.userUsername;
    const nickname = authService.userNick;
    const email = authService.userEmail;

    return `
                    <h1 class="mb-6 text-4xl font-bold">Settings</h1>
                    <h2 class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">Account</h2>

                    <div class="info flex-1 space-y-6">
                      <!-- Username -->
                      <div class="flex items-center space-x-3">
                        <label for="settings-username" class="w-20 font-semibold">Username</label>
                        <input id="settings-username" type="text" value="${username}" disabled readonly 
                        class="input-settings-disable" />
                        <span class="text-sm text-gray-400">🔒</span>
                      </div>

                      <!-- Email -->
                      <div class="flex items-center space-x-3">
                        <label for="settings-email" class="w-20 font-semibold">Email</label>
                        <input id="settings-email" type="text" value="${email}" disabled readonly 
                        class="input-settings-disable" />
                        <span class="text-sm text-gray-400">🔒</span>
                      </div>
                      
                      <!-- Name -->
                      <form>
                        <div class="flex items-center space-x-3">
                          <label for="settings-name" class="w-20 font-semibold">Name</label>
                          <input id="settings-name" type="text" value="${nickname}" 
                            pattern="^(?=.*[A-Za-z])[A-Za-z ]{2,40}$" 
                            required
                            title="Name must be 2–40 characters long and can include letters and spaces"
                            class="input-settings" />
                          <span class="edit transition-colors duration-200 hover:text-blue-300" title="Edit">✎</span>
                        </div>
                      </div>
                        
                      <!-- Save Button positioned at bottom right -->
                      <div class="mt-auto flex justify-end pt-6">
                        <button id="save-btn" type="submit" class="btn-settings ">Save</button>
                      </div>
                    </form>
                  `;
  },

  getSecurityHTML(): string {
    return `
          <h1 class="mb-6 text-4xl font-bold">Settings</h1>
          <h2 class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">Security</h2>

          <form id="security-form" class="flex flex-col flex-1 space-y-6">
            <!-- Old Password -->
            <div class="old-pass flex items-center space-x-3">
              <label for="old-pass" class="w-20 font-semibold text-center">Current password*</label>
              <input id="old-pass" type="password" required class="input-settings"
               />
            </div>

            <!-- New Password -->
            <div class="flex items-center space-x-3">
              <label for="new-pass" class="w-20 font-semibold text-center">New password</label>
              <input id="new-pass" type="password" class="input-settings" 
              pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*._\\-+=?])[A-Za-z\\d!@#$%^&*._\\-+=?]{8,}$"
              title="Must contain at least one digit, one uppercase and lowercase letter and one special character (!@#$%^&*.\\-_+=?)" data-i18n-title="register-title-pass"
              />
            </div>

            <div class="flex items-center">
              <h3 class="mr-6 text-l font-semibold">Enable/Disable 2FA</h3>
              <label class="relative inline-block w-[60px] h-[34px]">
                <input id="two-fac" type="checkbox" class="peer sr-only" 
                ${ authService.getHas2FA() ? "checked" : ""}
                >
                <span class="block bg-gray-500 peer-checked:bg-myWhite w-full h-full rounded-full transition-all duration-300"></span>
                <span class="absolute left-[3px] bottom-[3px] bg-blue-600 w-[28px] h-[28px] rounded-full transition-transform duration-300 peer-checked:translate-x-[26px]"></span>
              </label>
            </div>

            <div id="save-btn" class="mt-auto flex justify-end ">
             <button type="submit" class="btn-settings">Save</button>
            </div>
          </form>

    `;
  },

  getSocialHTML(): string {
    return `
          <h1 class="mb-6 text-4xl font-bold">Settings</h1>
          <h2 class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">Social</h2>

          <!-- Blocked Users List -->
          <h3 class="text-lg font-semibold mb-2">Blocked users</h3>

          <div id="blocked-users-list" class="overflow-y-auto max-h-[240px] pr-2 space-y-3">
            <!-- Will insert blocked users dynamically -->
            
          </div>


    `;
  },

  createBlockedFriendElement(userData: UserData, avatar: string): HTMLElement {
    const newElement = document.createElement("div") as HTMLDivElement;
    newElement.classList = `blocked-${userData.username} flex items-center justify-between bg-white/10 rounded-lg px-4 py-2`;
    newElement.innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${avatar}"
              alt="user-avatar"
              class="w-10 h-10 rounded-full border-2 border-yellow-400" />
          <span class="font-medium">${userData.name}</span>
        </div>
        <button class="unblock-btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white font-semibold transition duration-200"
                data-username="${userData.user_id}">
          Unblock
        </button>
         `;
    return newElement;
  },

  currentSection: "account" as "account" | "security" | "social",

  setCurretSection(section: "account" | "security" | "social"): void {
    if (SettingsPage.currentSection === section) {
      return;
    }

    SettingsPage.currentSection = section;
    SettingsPage.updateActiveSection();
    SettingsPage.updateContent();
  },

  updateActiveSection(): void {
    const sidebar = document.getElementById("settings-sidebar");
    if (!sidebar) return;

    const test = sidebar.querySelector(`.settings-active`);
    if (!test) return;

    test.classList.toggle("settings-active");
    const test2 = sidebar.querySelector(
      `#settings-${SettingsPage.currentSection}`
    );
    test2?.classList.toggle("settings-active");
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

  async initAccountEvents(): Promise<void> {
    const form = document.querySelector("form");
    if (!(form instanceof HTMLFormElement)) {
      console.warn("DEBUG: Form element not found or incorrect.");
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      try {
        const nameInput = form.querySelector<HTMLInputElement>("#settings-name");
        if (!nameInput) {
          console.error("DEBUG: Name input not found.");
          return;
        }

        const newName = nameInput.value.trim();
        if (newName === authService.userNick) {
          console.warn("DEBUG: Name unchanged.");
          return;
        }

        // Update backend and local auth state
        updateName(newName);
        authService.userNick = newName;

        // Update UI
        const profileHeaderName = document.getElementById("profile-link");
        if (profileHeaderName) {
          profileHeaderName.textContent = newName;
        } 

        const navBarName = document.getElementById("user-name");
        if (navBarName) {
          navBarName.textContent = newName;
        } 

      } catch (error) {
        console.error("DEBUG: Exception during account save:", error);
      }
    });
  },

  initEnable2FAEventListeners(): void {
    const content = document.getElementById("settings-content");
    if (!content) {
      console.error("DEUBG: No content container at show2FAActivation");
      return;
    }

    const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');

    inputs.forEach((input, idx) => {
      input.addEventListener('input', () => {
        const val = input.value;
        if (val.length === 1 && idx < inputs.length - 1)
            inputs[idx + 1].focus();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && idx > 0)
          inputs[idx - 1].focus();
      })
    });

    content.addEventListener("submit", async (e) => {
      e.preventDefault();

      const code = Array.from(inputs).map(input => input.value).join('');
      try {
        await confirmTwoFactorCode(code);
        // success
        authService.setHas2FA(true);
        this.updateContent();
      } catch (error) {
        if ((error as any).status == 401) {
          const loginError = document.getElementById('twofacode-error') as HTMLElement;
          loginError.textContent = "Verification code is incorrect!"
          loginError.hidden = false;
          console.error("DEBUG 2FA code wrong");
        }
        else {
          console.error("DEBUG: Unexpeted error", error);
          authService.logout()
        }
      }
    });
    return;
  },

  show2FAActivation(qrcode: string): void {
    const content = document.getElementById("settings-content");
    if (!content) {
      console.error("DEUBG: No content container at show2FAActivation");
      return;
    }


    content.innerHTML = `
      <h1 class="mb-6 text-4xl font-bold">Settings</h1>

      <h2 class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">Two Factor Authentication</h2>

      <p class="mb-6 text-sm text-white/90 max-w-lg">
        Read the following QR code on your Google Authenticator app and enter the verification code to activate 2FA.
      </p>

      <div class="flex items-center justify-center gap-16">
        <!-- QR Code -->
        <img src="${qrcode}" alt="qrcode" class="w-[100px] h-[100px] border border-white/20" />

        <!-- Form -->
        <form id="twofa-form" class="flex flex-col">
          <h4 class="mb-2 text-lg font-medium text-center">Verification Code</h4>
          <div id="otp-container" class="flex gap-2">
            <input type="text" placeholder="X" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" autofocus />
            <input type="text" placeholder="X" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder="X" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder="X" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder="X" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder="X" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
          </div>

          <div id="twofacode-error" aria-live="polite" hidden class="text-sm text-red-500 mt-2"></div>
          
          <div class="mt-auto flex justify-center ">
            <button type="submit" class="btn-settings mt-4">Verify</button>
          </div>
        </form>
      </div>
    `;
    return ;
  },

  initSecurityEvents(): void {
    const form = document.querySelector("#security-form");
    if (!(form instanceof HTMLFormElement)) {
      console.warn("DEBUG: Form element not found or incorrect.");
      return;
    }
    form.addEventListener("submit", async (event) => {
      try {
        event.preventDefault();

        const oldPass = form.querySelector<HTMLInputElement>("#old-pass");
        if (!oldPass || !oldPass.value) {
          console.warn("DEBUG: No old password.");
          return;
        }
        
        const newPass = form.querySelector<HTMLInputElement>("#new-pass");
        if (!newPass) {
          console.warn("DEBUG: No new password.");
          return;
        }
      
        const twoFactor = form.querySelector<HTMLInputElement>("#two-fac");
        if (!twoFactor) {
          console.warn("DEBUG: No two factor checkbox.");
          return;
        }       

        // update password
        if (newPass.value){
          try {
            updatePassword(oldPass.value, newPass.value);
          } catch (error: any) {
            if (error && (error.status === 401)) {
              console.warn("DEBUG: Unauthorized (401) error.");
              // todo error message that shows that the password was wrong
            } else {
              console.error("DEBUG: Error updating password:", error);
            }
            return ;
          }
        }

        if (twoFactor) {
          if (twoFactor.checked === authService.getHas2FA()) return;

          if (authService.getHas2FA()) {
            // todo disable twofa
          }
          else {
            try {
              const qrcode = await enableTwoFactor();
              this.show2FAActivation(qrcode);
              this.initEnable2FAEventListeners();

            } catch (error) {
              console.warn("DEBUG: Error enabling 2fa", error);
              authService.logout();
            }
          }
        }
      } catch (error) {
        
      }
    });
  },

  initSocialEvents(): void {
    // Add blocked friends list
    // need endpoint for that
    // this is mock data
    // add a loop after getting all blocked users and append with somehting like that
    let user1: UserData = {
      user_id: 1,
      name: "panela",
      username: "aaa-s",
      email: "a@example.com",
    };

    let user2: UserData = {
      user_id: 1,
      name: "puta",
      username: "www-s",
      email: "a@example.com",
    };

    let user3: UserData = {
      user_id: 1,
      name: "pariu",
      username: "qweqwe-s",
      email: "a@example.com",
    };

    let avatar =
      "https://occ-0-8407-92.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABUqatshN8F7cMuNtNde6DqnltLSeN4ZVpl00kvU65RKdUO0HqEL1q3hAf3Zfdc2FlRn14S9eBrpEwHDb_LdsWH_iMRbDxdhy8KJx.jpg?r=9b9";

    const blockList = document.getElementById("blocked-users-list");
    if (!blockList) return;

    const newFriendElement: HTMLElement = this.createBlockedFriendElement(
      user1,
      avatar
    );
    blockList.insertAdjacentElement("beforeend", newFriendElement);

    const newFriendElement2: HTMLElement = this.createBlockedFriendElement(
      user2,
      avatar
    );
    blockList.insertAdjacentElement("beforeend", newFriendElement2);

    const newFriendElement3: HTMLElement = this.createBlockedFriendElement(
      user3,
      avatar
    );
    blockList.insertAdjacentElement("beforeend", newFriendElement3);

    // block user by username
    // add the event listener

    // unblock contact for specific user
    // btn unblock has data-username="${userData.user_id} so we can use that
  },

  initChangeAvatarEventListener(): void {
    const input = document.getElementById("avatar-upload") as HTMLInputElement | null;
    const avatarImg = document.getElementById("user-avatar") as HTMLImageElement | null;
    const headerAvatarImg = document.querySelector(".profile-container .profile-avatar") as HTMLImageElement | null;

    if (input && avatarImg) {
      input.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
          console.warn("No file selected.");
          return;
        }

        if (!file.type.startsWith("image/")) {
          console.error("Selected file is not an image.");
          return;
        }

        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

        if (file.size > MAX_FILE_SIZE) {
          console.error("DEBUG: File is too large. Maximum size is 10MB.");
          // TODO SHOW ERROR
          return;
        }


        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result;
          if (typeof result === "string") {
            avatarImg.src = result;
            if (headerAvatarImg) {
              headerAvatarImg.src = result;
            }

            uploadAvatar(file);
          } else {
            console.error("Unexpected result type from FileReader.");
          }
        };

        reader.onerror = (e: ProgressEvent<FileReader>) => {
          console.error("DEBUG: Error reading file:", e.target?.error);
        };

        try {
          reader.readAsDataURL(file);
        } catch (err) {
          console.error("DEBUG: Failed to read file:", err);
        }
      });
    } else {
      console.error("DEBUG: Input or avatar image element not found in DOM.");
    }
  },

  init(): void {
    SettingsPage.currentSection = "account";

    SettingsPage.initChangeAvatarEventListener();

    SettingsPage.initAccountEvents();

    // Event listener delegations
    const container = document.getElementById("settings-sidebar");

    if (container) {
      container.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLElement;


        if (target.matches("#settings-account")) {
          SettingsPage.setCurretSection("account");
        } else if (target.matches("#settings-security")) {
          SettingsPage.setCurretSection("security");
        } else if (target.matches("#settings-social")) {
          SettingsPage.setCurretSection("social");
        } else if (target.matches("#settings-logout")){
          authService.logout();
        }
      });
    }

    // update profile picture event listener on avatar
  },
};
