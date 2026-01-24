import { getUserDataById } from "../../api/userData/getUserDataByIDAPI";
import { UserData } from "../../api/userData/types/UserDataType";
import { authService } from "../../services/authService";
import { updateName } from "../../api/settings/updateNameAPI";
import { updatePassword } from "../../api/settings/updatePasswordAPI";
import { enableTwoFactor } from "../../api/settings/twoFactorAPIS/enableTwoFactorAPI";
import { confirmTwoFactorCode } from "../../api/settings/twoFactorAPIS/confirmEnableTwoFactorAPI";
import { uploadAvatar } from "../../api/settings/uploadAvatarAPI";
import { WarningPopup } from "../../utils/popUpWarn";
import { ErrorPopup } from "../../utils/popUpError";
import { SuccessPopup } from "../../utils/popUpSuccess";
import { BlockedStatus, getBlockedUsers } from "../../api/block/getAllBlockedAPI";
import { getUserAvatarById } from "../../api/userData/getUserAvatarAPI";
import { unblockByUserID } from "../../api/block/unblockByIDAPI";
import { blockByUserName } from "../../api/block/blockByUsernameAPI";
import { PaddleCarrossel } from "../../components/carrossel/paddleCarrossel";
import { setupKeyCaptureButton } from "../play/utils/stylingComponents";
import { savePlayerPreferences } from "../../api/settings/preferences/savePlayerPreferencesAPI";
import { getPlayerPreferences } from "../../api/settings/preferences/getPlayerPreferencesAPI";
import { PlayerPreferences } from "../../api/settings/preferences/PreferenceInterface";

import { translator } from "../../services/translationService";

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
                  <button data-i18n="settings-nav-account" id="settings-account" class="transition- w-full rounded-sm border-t border-white/20 py-2 font-bold brightness-85 duration-300 ease-in-out hover:bg-gray-400/60 hover:brightness-100 settings-active">Account</button>
                  <button data-i18n="settings-nav-preferences" id="settings-preferences" class="w-full rounded-sm border-y border-white/20 py-2 font-bold brightness-85 transition-all duration-300 ease-in-out hover:bg-gray-400/60 hover:brightness-100">Preferences</button>
                  <button data-i18n="settings-nav-security" id="settings-security" class="w-full rounded-sm border-t border-white/20 py-2 font-bold brightness-85 transition-all duration-300 ease-in-out hover:bg-gray-400/60 hover:brightness-100">Security</button>
                  <button data-i18n="settings-nav-social" id="settings-social" class="w-full rounded-sm border-y border-white/20 py-2 font-bold brightness-85 transition-all duration-300 ease-in-out hover:bg-gray-400/60 hover:brightness-100">Social</button>
                </div>

                <!-- LOGOUT -->
                <div class="mt-auto w-full">
                  <button data-i18n="settings-nav-logout" id="settings-logout" class="w-full rounded-sm border-t border-white/20 py-2 brightness-85 transition-all duration-200 ease-in hover:bg-red-500/70 hover:brightness-100">Log Out</button>
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
            <h1 data-i18n="settings-account-title" class="mb-6 text-4xl font-bold">Settings</h1>
            <h2 data-i18n="settings-account-subtitle" class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">Account</h2>

            <div class="info flex-1 space-y-6">
              <!-- Username -->
              <div class="flex items-center space-x-3">
                <label data-i18n="settings-account-username" for="settings-username" class="w-20 font-semibold">Username</label>
                <input id="settings-username" type="text" value="${username}" disabled readonly 
                class="input-settings-disable" />
                <span class="text-sm text-gray-400">🔒</span>
              </div>

              <!-- Email -->
              <div class="flex items-center space-x-3">
                <label data-i18n="settings-account-email" for="settings-email" class="w-20 font-semibold">Email</label>
                <input id="settings-email" type="text" value="${email}" disabled readonly 
                class="input-settings-disable" />
                <span class="text-sm text-gray-400">🔒</span>
              </div>
              
              <!-- Name -->
              <form>
                <div class="flex items-center space-x-3">
                  <label data-i18n="settings-account-name" for="settings-name" class="w-20 font-semibold">Name</label>
                  <input id="settings-name" type="text" value="${nickname}" 
                    pattern="^(?=.*[A-Za-z])[A-Za-z ]{2,15}$" 
                    required
                    title="Name must be 2–15 characters long and can include letters and spaces"
                    class="input-settings" />
                  <span class="edit transition-colors duration-200 hover:text-blue-300" title="Edit">✎</span>
                </div>
                
                <!-- Save button -->
                <div class="mt-auto flex justify-end pt-6">
                  <button id="save-btn" type="submit" class="btn-settings " data-i18n="settings-save-btn">Save</button>
                </div>
              </form>
              `;
  },

  getSecurityHTML(): string {
    return `
          <h1 data-i18n="settings-secutiry-title" class="mb-6 text-4xl font-bold">Settings</h1>
          <h2 class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold" data-i18n="settings-secutiry-subtitle">Security</h2>

          <form id="security-form" class="flex flex-col flex-1 space-y-6">

            <!-- hidden username so password manager can work -->
            <input type="text" class="hidden" autocomplete="username" />

            <!-- Old Password -->
            <div class="old-pass flex items-center space-x-3">
              <label data-i18n="settings-secutiry-current-password" for="old-pass" class="w-20 font-semibold text-center mr-4">Current password*</label>
              <input id="old-pass" type="password" autocomplete="current-password" required class="input-settings"
               />
            </div>

            <!-- New Password -->
            <div class="flex items-center space-x-3">
              <label data-i18n="settings-secutiry-new-password" for="new-pass" class="w-20 font-semibold text-center mr-4">New password</label>
              <input id="new-pass" autocomplete="new-password" type="password" class="input-settings"
              pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*._\\-+=?])[A-Za-z\\d!@#$%^&*._\\-+=?]{8,}$"
              title="Must contain at least one digit, one uppercase and lowercase letter and one special character (!@#$%^&*.\\-_+=?)" data-i18n-title="register-title-pass"
              />
            </div>

            <div class="flex items-center">
              <h3 data-i18n="settings-secutiry-twofa" class="mr-6 text-l font-semibold">${translator.get("settings-secutiry-twofa")}</h3>
              <label class="relative inline-block w-[60px] h-[34px]">
                <input id="two-fac" type="checkbox" class="peer sr-only" 
                ${authService.getHas2FA() ? "checked" : ""}
                >
                <span class="block bg-gray-500 peer-checked:bg-myWhite w-full h-full rounded-full transition-all duration-300"></span>
                <span class="absolute left-[3px] bottom-[3px] bg-blue-600 w-[28px] h-[28px] rounded-full transition-transform duration-300 peer-checked:translate-x-[26px]"></span>
              </label>
            </div>

            <div id="save-btn" class="mt-auto flex justify-end ">
             <button data-i18n="settings-save-btn" type="submit" class="btn-settings">Save</button>
            </div>
          </form>

    `;
  },

  async getSocialHTML(): Promise<string> {
    let blockListHTML: string = "";

    try {
      // fetch all blocked users
      const blockedUsers = await getBlockedUsers() as BlockedStatus[];
      for (const block of blockedUsers) {
        // redundant check cuz davi is a monkey
        if (block.blocked_user_id !== authService.userID) {

          const userData: UserData = await getUserDataById(block.blocked_user_id);
          const userAvatar: string = await getUserAvatarById(block.blocked_user_id);

          blockListHTML += this.createBlockedFriendElement(userData, userAvatar).outerHTML;
        }
      }
    } catch (error) {

    }


    return `
          <h1 data-i18n="settings-social-title" class="mb-6 text-4xl font-bold">${translator.get("settings-social-title")}</h1>
          <h2 data-i18n="settings-social-subtitle" class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">${translator.get("settings-social-subtitle")}</h2>

          <!-- Blocked Users List -->
          <h3 data-i18n="settings-social-blocked" class="font-semibold mb-2">${translator.get("settings-social-blocked")}</h3>

          <div id="blocked-users-list" class="overflow-y-auto h-[240px] pr-2 space-y-3 no-scrollbar">
            <!-- Will insert blocked users dynamically -->
              ${blockListHTML.trim() === "" ? `<p data-i18n="settings-social-noblocked">${translator.get("settings-social-noblocked")}</p>` : blockListHTML}
          </div>

          <!-- Block User by Username -->
          <div class="mt-4">
            <h3 data-i18n="settings-social-blockuser" class="font-semibold mb-1">${translator.get("settings-social-blockuser")}</h3>
            <div class="flex items-center space-x-3">
              <input  id="username-to-block" type="text" class="input-settings" placeholder="${translator.get("settings-social-blockuser-placeholder")}" data-i18n-placeholder="settings-social-blockuser-placeholder" />
              <button id="block-btn"  class="btn-settings" data-i18n="settings-social-blockuser-btn">${translator.get("settings-social-blockuser-btn")}</button>
            </div>
          </div>
    `;
  },

  getPreferencesHTML(): string {
    return `
          <h1 data-i18n="settings-preferences-title" class="mb-6 text-4xl font-bold">Settings</h1>
          <h2 data-i18n="settings-preferences-subtitle" class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">Preferences</h2>

          <form id="player-settings" method="dialog">
            <!-- Alias Section -->
            <div class="flex items-center space-x-3 mb-6">
              <label for="player-alias" data-i18n="settings-preferences-alias" class="w-20 block text-base font-semibold text-white mb-2">Alias</label>
              <input data-i18n-placeholder="settings-preferences-alias-placeholder"
                id="player-alias"
                name="player-alias"
                type="text"
                class="input-settings"
                placeholder="Enter your alias"
                required
              />
            </div>

            <!-- Paddle Section -->
            <div class="flex items-center space-x-3 mb-6">
              <h3 data-i18n="settings-preferences-paddle" class="w-20 block text-base font-semibold text-white mb-2">Paddle</h3>
              ${PaddleCarrossel.getPaddleCarrosselHTML()}
            </div>



            <!-- Controls Section -->
            <div class="flex gap-20 items-center justify-center mb-6">
              <div class="flex flex-col justify-center gap-1">
                  <label  for="up-config" data-i18n="settings-preferences-up-btn" class="block text-base font-semibold text-white text-center">Up Button</label>
                  <button 
                      type="button" 
                      id="up-config" 
                      class="px-2 py-1.5 bg-slate-600/80 border border-slate-500/50 rounded-xl text-white text-base cursor-pointer transition-all duration-200 text-center font-semibold hover:bg-slate-600/90 hover:border-blue-500 active:bg-blue-500/20"
                  >ArrowUp</button>
                  <input type="hidden" id="up-key" name="up-key" value="ArrowUp">
              </div>

              <div class="flex flex-col justify-center gap-1">
                  <label  for="down-config" data-i18n="settings-preferences-down-btn" class="block text-base font-semibold text-white text-center">Down Button</label>
                  <button 
                      type="button" 
                      id="down-config" 
                      class="px-2 py-1.5 bg-slate-600/80 border border-slate-500/50 rounded-xl text-white text-base cursor-pointer transition-all duration-200 text-center font-semibold hover:bg-slate-600/90 hover:border-blue-500 active:bg-blue-500/20"
                  >ArrowDown</button>
                  <input type="hidden" id="down-key" name="down-key" value="ArrowDown">
              </div>
            </div>


            <!-- Submit Button -->
            <div class="-mt-4 flex justify-end ">
             <button data-i18n="settings-save-btn" id="save-btn" type="submit" class="btn-settings">Save</button>
            </div>
          </form>
    `;

  },

  createBlockedFriendElement(userData: UserData, avatar: string): HTMLElement {
    const newElement = document.createElement("div") as HTMLDivElement;
    newElement.classList = `blocked flex items-center justify-between bg-white/10 rounded-lg px-4 py-2`;
    newElement.setAttribute("data-id", userData.id.toString());
    newElement.innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${avatar}"
              alt="user-avatar"
              class="w-10 h-10 rounded-full border-2 border-yellow-400" />
          <span class="font-medium">${userData.username}</span>
        </div>
        <button data-i18n="settings-social-unblockuser-btn" class="unblock-btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white font-semibold transition duration-200"
                data-id="${userData.id}">
          ${translator.get("settings-social-unblockuser-btn")}
        </button>
         `;
    return newElement;
  },

  currentSection: "account" as "account" | "security" | "social" | "preferences",

  setCurrentSection(section: "account" | "security" | "social" | "preferences"): void {
    if (SettingsPage.currentSection === section) {
      return;
    }

    SettingsPage.currentSection = section;
    SettingsPage.updateActiveSection();
    SettingsPage.updateContent();
    translator.apply();
  },

  updateActiveSection(): void {
    const sidebar = document.getElementById("settings-sidebar");
    if (!sidebar) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly. Please refresh and try again."
      );
      return;
    }

    const test = sidebar.querySelector(`.settings-active`);
    if (!test) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly. Please refresh and try again."
      );
      return;
    }

    test.classList.toggle("settings-active");
    const test2 = sidebar.querySelector(
      `#settings-${SettingsPage.currentSection}`
    );
    test2?.classList.toggle("settings-active");
  },

  async updateContent(): Promise<void> {
    const content = document.getElementById("settings-content");
    if (!content) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly. Please refresh and try again."
      );
      return;
    }

    switch (SettingsPage.currentSection) {
      case "account":
        content.innerHTML = (SettingsPage.getAccountHTML());
        SettingsPage.initAccountEvents();
        break;
      case "security":
        content.innerHTML = (SettingsPage.getSecurityHTML());
        SettingsPage.initSecurityEvents();
        break;
      case "social":
        content.innerHTML = (await SettingsPage.getSocialHTML());
        SettingsPage.initSocialEvents();
        break;
      case "preferences":
        content.innerHTML = (SettingsPage.getPreferencesHTML());
        SettingsPage.initPreferencesEvents();
    }
  },

  async initAccountEvents(): Promise<void> {
    const form = document.querySelector("form");
    if (!(form instanceof HTMLFormElement)) {
      console.warn("DEBUG: Form element not found or incorrect.");
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly..."
      );
      return;
    }

    form.addEventListener("submit", async (event) => {

      event.preventDefault();

      try {
        const nameInput =
          form.querySelector<HTMLInputElement>("#settings-name");
        if (!nameInput) {
          console.error("DEBUG: Name input not found.");

          const warnPopup = new WarningPopup();
          warnPopup.create(
            "Something is strange...",
            "Seems like the page was not loaded correctly..."
          );
          return;
        }

        const newName = nameInput.value.trim();
        if (newName === authService.userNick) {
          console.warn("DEBUG: Name unchanged.");
          const warnPopup = new WarningPopup();
          warnPopup.create(
            "Nickname Not Updated...",
            "Seems like your new nickname is the same as the old one..."
          );
          return;
        }

        // Update backend and local auth state
        await updateName(newName);
        authService.userNick = newName;

        { // UI feedback
          const succPopup = new SuccessPopup();
          succPopup.create("Name Successfully Changed", "Your display name has been successfully updated!");
        }

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

        const errPopup = new ErrorPopup();
        errPopup.create(
          "Error Updating Account settings",
          "Seems like there was an error updating your informatiom. Please refresh and try again"
        );
        return;
      }
    });
  },

  initEnable2FAEventListeners(): void {
    const content = document.getElementById("settings-content");
    if (!content) {
      console.error("DEUBG: No content container at show2FAActivation");

      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly..."
      );
      return;
    }

    const inputs = document.querySelectorAll<HTMLInputElement>(".otp-input");

    inputs.forEach((input, idx) => {
      input.addEventListener("input", () => {
        const val = input.value;
        if (val.length === 1 && idx < inputs.length - 1)
          inputs[idx + 1].focus();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && idx > 0)
          inputs[idx - 1].focus();
      });
    });

    content.addEventListener("submit", async (e) => {
      e.preventDefault();

      const code = Array.from(inputs)
        .map((input) => input.value)
        .join("");
      try {
        await confirmTwoFactorCode(code);
        // success
        authService.setHas2FA(true);
        this.updateContent();

        //UI feedback
        const succPopup = new SuccessPopup();
        succPopup.create("Two Factor Authentication Updated", "Your account two factor authentication has been successfully updated!");
      } catch (error) {
        if ((error as any).status == 401) {
          console.error("DEBUG 2FA code wrong");

          const loginError = document.getElementById(
            "twofacode-error"
          ) as HTMLElement;
          loginError.textContent = "Verification code is incorrect!";
          loginError.hidden = false;
        } else {
          console.error("DEBUG: Unexpeted error", error);

          const warnPopup = new WarningPopup();
          warnPopup.create(
            "Something is strange...",
            "Seems like the page was not loaded correctly..."
          );
          authService.logout();
        }
      }
    });
    return;
  },

  show2FAActivation(qrcode: string): void {
    const content = document.getElementById("settings-content");
    if (!content) {
      console.error("DEUBG: No content container at show2FAActivation");

      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly..."
      );
      return;
    }

    content.innerHTML = (`
      <h1 data-i18n="settings-twofa-title" class="mb-6 text-4xl font-bold">Settings</h1>

      <h2 data-i18n="settings-twofa-subtitle" class="mb-4 border-t border-white/20 pt-4 text-2xl font-semibold">Two Factor Authentication</h2>

      <p data-i18n="settings-twofa-description" class="mb-6 text-sm text-white/90 max-w-lg">
        Read the following QR code on your Google Authenticator app and enter the verification code to activate 2FA.
      </p>

      <div class="flex items-center justify-center gap-16">
        <!-- QR Code -->
        <img src="${qrcode}" alt="qrcode" class="w-[100px] h-[100px] border border-white/20" />

        <!-- Form -->
        <form id="twofa-form" class="flex flex-col">
          <h4 data-i18n="settings-twofa-code" class="mb-2 text-lg font-medium text-center">Verification Code</h4>
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
            <button data-i18n="settings-twofa-verify" type="submit" class="btn-settings mt-4">Verify</button>
          </div>
        </form>
      </div>
    `);
    return;
  },

  initSecurityEvents(): void {
    const form = document.querySelector("#security-form");
    if (!(form instanceof HTMLFormElement)) {
      console.warn("DEBUG: Form element not found or incorrect.");

      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly..."
      );
      return;
    }
    form.addEventListener("submit", async (event) => {
      try {
        event.preventDefault();

        const oldPass = form.querySelector<HTMLInputElement>("#old-pass");
        const newPass = form.querySelector<HTMLInputElement>("#new-pass");
        const twoFactor = form.querySelector<HTMLInputElement>("#two-fac");

        if (!oldPass || !oldPass.value || !newPass || !twoFactor) {
          console.warn("DEBUG: Security page error.");

          const warnPopup = new WarningPopup();
          warnPopup.create(
            "Something is strange...",
            "Seems like the page was not loaded correctly..."
          );
          return;
        }

        // update password
        if (newPass.value) {
          try {
            await updatePassword(oldPass.value, newPass.value);

            //UI feedback
            const succPopup = new SuccessPopup();
            succPopup.create("Password Changed Successfully", "Your password has been successfully changed!");
          } catch (error: any) {
            if (error && error.status === 401) {
              console.warn("DEBUG: Unauthorized (401) error.");

              const errPopup = new ErrorPopup();
              errPopup.create(
                "Error Updating Password...",
                "Password was not updated. Please make sure to type your correct old password."
              );
            } else {
              console.error("DEBUG: Error updating password:", error);

              const errPopup = new ErrorPopup();
              errPopup.create(
                "Something Went Wrong...",
                "Seems like something went wrong while updating your password. Please refresh and try again."
              );
            }
            return;
          }
        }

        if (twoFactor) {
          if (twoFactor.checked === authService.getHas2FA()) {
            return;
          }

          if (authService.getHas2FA()) {
            // todo disable twofa
          } else {
            try {
              const qrcode = await enableTwoFactor();
              this.show2FAActivation(qrcode);
              this.initEnable2FAEventListeners();
            } catch (error) {
              console.warn("DEBUG: Error enabling 2fa", error);

              const errPopup = new ErrorPopup();
              errPopup.create(
                "Error Updating 2FA...",
                "There was an error updating the 2FA status. Please reload and try again."
              );
              authService.logout();
            }
          }
        }
      } catch (error) { }
    });
  },

  initSocialEvents(): void {
    // block user by username
    // add the event listener
    const blockedList = document.getElementById("blocked-users-list");
    if (!blockedList) {
      console.error("DEBUG: No blocked list container found.");

      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly..."
      );
      return;
    }

    // event delegation for unblock buttons
    blockedList.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("unblock-btn")) {
        const userID = parseInt(target.getAttribute("data-id") || "");
        if (isNaN(userID)) {
          console.error("DEBUG: Invalid user id on unblock button.");
          return;
        }

        try {
          // call the unblock API
          await unblockByUserID(userID);
          // remove from DOM
          const blockedDiv = target.closest(
            ".blocked"
          ) as HTMLDivElement | null;
          if (blockedDiv) {
            blockedDiv.remove();
          }

          // UI feedback
          const succPopup = new SuccessPopup();
          succPopup.create("User Unblocked", "The user was successfully unblocked.");
        } catch (error) {
          console.error("DEBUG: Error unblocking user:", error);

          const errPopup = new ErrorPopup();
          errPopup.create(
            "Error Unblocking User",
            "Seems like there was an error unblocking the user. Please refresh and try again."
          );
        }
      }
    });


    // block user by username
    const blockBtn = document.getElementById("block-btn");
    const usernameInput = document.getElementById("username-to-block");
    if (!blockBtn || !usernameInput) {
      console.error("DEBUG: Block button or username input not found.");

      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly..."
      );
      return;
    }

    blockBtn.addEventListener("click", async () => {
      const username = (usernameInput as HTMLInputElement).value.trim();
      if (!username) {
        const warnPopup = new WarningPopup();
        warnPopup.create("Invalid Username", "Please enter a valid username to block.");
        return;
      }

      if (username === authService.userUsername) {
        const warnPopup = new WarningPopup();
        warnPopup.create("Invalid Username", "You cannot block yourself.");
        return;
      }

      try {
        await blockByUserName(username);

        // refresh the blocked list
        const socialHTML = await SettingsPage.getSocialHTML();
        const content = document.getElementById("settings-content");
        if (content) {
          content.innerHTML = (socialHTML);
          SettingsPage.initSocialEvents();
        }

        // check if blocked a friend and update friends list if so
        if (authService.isUserAuthenticated()) {
          // returns null if not found
          const friendConvID = authService.sidebar?.getConvIDByFriendUsername(username);
          if (friendConvID) {
            authService.sidebar?.deleteContact(friendConvID);
          }
        }

        // UI feedback
        const succPopup = new SuccessPopup();
        succPopup.create("User Blocked", `The user ${username} was successfully blocked.`);
      } catch (error: any) {
        // todo add code for when username is invalid and for when user has been already blocked
        // todo note that the backend returns 400 for both cases
        // todo note that both users can be blocked by each other
        if (error?.status == 400) {
          const warnPopup = new WarningPopup();
          warnPopup.create("Invalid Username", `The username ${username} is invalid. Please check and try again.`);
          return;
        }
        else {
          const errPopup = new ErrorPopup();
          errPopup.create("Unexpected Error", `The username ${username} could not be blocked.`);
          return;
        }
        console.error("DEBUG: Error blocking user:", error);
      }
    });

  },

  initChangeAvatarEventListener(): void {
    const input = document.getElementById(
      "avatar-upload"
    ) as HTMLInputElement | null;
    const avatarImg = document.getElementById(
      "user-avatar"
    ) as HTMLImageElement | null;
    const headerAvatarImg = document.querySelector(
      ".profile-avatar"
    ) as HTMLImageElement | null;

    if (input && avatarImg) {
      input.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
          const warnPopup = new WarningPopup();
          warnPopup.create("Avatar Not Changed", "Seems like we could not read any file. Please try again");
          console.warn("No file selected.");
          return;
        }

        if (!file.type.startsWith("image/")) {
          const errPopup = new ErrorPopup();
          errPopup.create("Avatar Not Changed", "Seems like the selected file was not an image. Please try again with an image");
          console.error("Selected file is not an image.");
          return;
        }

        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

        if (file.size > MAX_FILE_SIZE) {
          const errPopup = new ErrorPopup();
          errPopup.create("Avatar Not Changed", "Seems like the file was too large. Please try again with an image less than 10MB");
          console.error("DEBUG: File is too large. Maximum size is 10MB.");
          return;
        }

        const reader = new FileReader();

        reader.onload = async (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result;

          try {
            if (typeof result !== "string") {
              console.error("DEBUG: Unexpected result type from FileReader.");
              throw new Error("Unexpected result type from FileReader.");
            }

            await uploadAvatar(file);

            avatarImg.src = result;
            if (headerAvatarImg) {
              headerAvatarImg.src = result;
            }

            const succPopup = new SuccessPopup();
            succPopup.create("Avatar Successfully Changed", "Your profile avatar was successfully changed!");
            return;
          } catch (error) {
            const errPopup = new ErrorPopup();
            errPopup.create("Avatar Not Changed", "Seems like there was an error uploading your avatar. Please refresh the page and try again");
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

  async initPreferencesEvents(): Promise<void> {
    // load player preferences
    let prefs: PlayerPreferences;
    try {
      //todo  const prefs = await getPlayerPreferences();
      prefs = {
        alias: "",
        paddleID: 3,
        keybinds: {
          upKey: "w",
          downKey: "s",
        },
      };
    } catch (error) {
      console.error("DEBUG: Error loading player preferences:", error);
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like there was an error loading your preferences. Please refresh and try again."
      );

      // default prefs
      prefs = {
        alias: "",
        paddleID: 1,
        keybinds: {
          upKey: "ArrowUp",
          downKey: "ArrowDown",
        },
      };
    }

    const aliasInput = document.getElementById("player-alias") as HTMLInputElement;
    const upKeyInput = document.getElementById("up-key") as HTMLInputElement;
    const downKeyInput = document.getElementById("down-key") as HTMLInputElement;
    const paddleInput = document.getElementById("player-paddle") as HTMLInputElement;

    if (prefs && aliasInput && upKeyInput && downKeyInput && paddleInput) {
      aliasInput.value = prefs.alias;
      upKeyInput.value = prefs.keybinds.upKey;
      downKeyInput.value = prefs.keybinds.downKey;
      paddleInput.value = prefs.paddleID.toString();

      // update button text
      const upButton = document.getElementById("up-config");
      const downButton = document.getElementById("down-config");
      if (upButton) upButton.textContent = prefs.keybinds.upKey;
      if (downButton) downButton.textContent = prefs.keybinds.downKey;
    }

    // constructor inits event listeners
    const paddleCarrossel = new PaddleCarrossel(
      "paddle-prev",
      "paddle-next",
      "paddle-image",
      "player-paddle"
    );

    // key capture buttons
    const upListener = document.getElementById("up-config") as HTMLButtonElement
    const downListener = document.getElementById("down-config") as HTMLButtonElement
    const upInput = document.getElementById("up-key") as HTMLInputElement
    const downInput = document.getElementById("down-key") as HTMLInputElement

    setupKeyCaptureButton(upListener, upInput)
    setupKeyCaptureButton(downListener, downInput)


    // form submit
    const form = document.getElementById("player-settings");
    if (!(form instanceof HTMLFormElement)) {
      console.warn("DEBUG: Form element not found or incorrect.");

      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly..."
      );
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const aliasInput = form.querySelector<HTMLInputElement>("#player-alias");
      const upKeyInput = form.querySelector<HTMLInputElement>("#up-key");
      const downKeyInput = form.querySelector<HTMLInputElement>("#down-key");
      const paddleInput = form.querySelector<HTMLInputElement>("#player-paddle");

      if (!aliasInput || !upKeyInput || !downKeyInput || !paddleInput) {
        console.error("DEBUG: Preferences inputs not found.");

        const warnPopup = new WarningPopup();
        warnPopup.create(
          "Something is strange...",
          "Seems like the page was not loaded correctly..."
        );
        return;
      }

      try {
        const newAlias = aliasInput.value.trim();
        const newUpKey = upKeyInput.value;
        const newDownKey = downKeyInput.value;
        const newPaddle = parseInt(paddleInput.value, 10);

        const playerPreferences: PlayerPreferences = {
          alias: newAlias,
          paddleID: newPaddle,
          keybinds: {
            upKey: newUpKey,
            downKey: newDownKey,
          },
        };

        console.log("DEBUG: Saving player Preferences:", playerPreferences);
        // todo await savePlayerPreferences(playerPreferences);

        // UI feedback
        const succPopup = new SuccessPopup();
        succPopup.create("Preferences Saved", "Your player preferences have been successfully saved!");
      } catch (error) {
        console.error("DEBUG: Error parsing preferences input:", error);

        const errPopup = new ErrorPopup();
        errPopup.create(
          "Error Saving Preferences",
          "Seems like there was an error saving your preferences. Please refresh and try again."
        );
        return;
      }
    });

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
          SettingsPage.setCurrentSection("account");
        } else if (target.matches("#settings-preferences")) {
          SettingsPage.setCurrentSection("preferences");
        } else if (target.matches("#settings-security")) {
          SettingsPage.setCurrentSection("security");
        } else if (target.matches("#settings-social")) {
          SettingsPage.setCurrentSection("social");
        } else if (target.matches("#settings-logout")) {
          authService.logout();
        }
      });
    }

    // update profile picture event listener on avatar
  },
};