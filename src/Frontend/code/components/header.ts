import { authService } from "../services/authService";
import { translator } from "../services/translationService";
import { router } from "../routes/router";
import { LanguageCode } from "../languages/languages";

/**
 * @class Header
 * @brief Handles the application's header logic, including navigation updates,
 * language switching, and header-authentication-related UI updates.
 */
class Header {
  private navBarElement: HTMLElement | null;

  /**
   * @brief Initializes the header by setting up event listeners and language configuration.
   */
  constructor() {
    this.navBarElement = document.getElementById("header-nav");
  }
  
  init() {
    this.logOutEventListener();
    this.languageSelectorDisplayEventListener();
    this.languageSelectorChangeEventListener();
    this.languageInit();
  }

  /**
   * @brief Sets up the logout button click event listener.
   * Logs the user out via the authentication service and redirects to the homepage.
   */
  logOutEventListener(): void {
    if (!this.navBarElement) return;
    this.navBarElement.addEventListener("click", (event: Event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target?.closest("#logout")) {
        authService.logout();
        router.navigateTo("/");
      }
    });
  }

  /**
   * @brief Sets up the click event listener for toggling the visibility of the language selector dropdown.
   */
  languageSelectorDisplayEventListener(): void {
    const dropDown = document.querySelector(".current-language") as HTMLElement;
    const langList = document.querySelector(".lang-options") as HTMLElement;
    if (!dropDown || !langList) return;

    dropDown.addEventListener("click", (e: Event) => {
      e.preventDefault();
      langList.style.display =
        langList.style.display === "none" ? "block" : "none";
    });
  }

  /**
   * @brief Updates the active underline on the navigation link based on the current route.
   * 
   * @param path The path of the current route to match against nav link hrefs.
   */
  updateActiveUnderline(path: string): void {
    const curActive = document.querySelector("a.nav-link.active") as HTMLElement;
    const newActive = document.querySelector(`a.nav-link[href='${path}']`) as HTMLElement;

    if (curActive && newActive && curActive !== newActive) {
      curActive.classList.remove("active");
      newActive.classList.add("active");
    }
  }

  /**
   * @brief Creates and returns a new HTML element with optional id and class attributes.
   * 
   * @param elementType The type of element to create (e.g., "div", "a").
   * @param id Optional ID to assign to the element.
   * @param classList Optional class list to assign to the element.
   * @return HTMLElement The newly created element.
   */
  createElement(
    elementType: string,
    id: string | null = null,
    classList: string | null = null
  ): HTMLElement {
    const newElement: HTMLElement = document.createElement(elementType);

    if (id) {
      newElement.id = id;
    }

    if (classList) {
      newElement.classList = classList;
    }

    return newElement;
  }

  /**
   * @brief Updates the header UI based on the user's authentication state.
   * Displays login/register buttons if logged out, or user info and logout if logged in.
   */
  updateHeaderVisibility(): void {
    let loggedOut = document.getElementById("log-reg") as HTMLElement;
    let loggedIn = document.getElementById("user-in") as HTMLElement;

    /**
     * @brief Displays the header layout for logged-out users.
     */
    const showLoggedOutVersion = () => {
      if (loggedIn) {
        loggedIn.remove();
      }

      if (loggedOut) return;
      loggedOut = this.createElement("div", "log-reg", "log-reg flex gap-24");

      loggedOut.innerHTML = `
        <a id="login-link" class="nav-link" href="/login" data-link data-i18n="header-login">Login</a>
        <a id="register-link" class="nav-link" href="/register" data-link data-i18n="header-register">Register</a>
      `;

      this.navBarElement?.appendChild(loggedOut);
    };

    /**
     * @brief Displays the header layout for logged-in users.
     * 
     * @param nickname The user's nickname to display.
     * @param avatarURL The user's avatar image URL.
     */
    const showLoggedInVersion = (nickname: string, avatarURL: string) => {
      if (loggedOut) {
        loggedOut.remove();
      }
      if (loggedIn) return;

      loggedIn = this.createElement("div", "user-in", "user-in flex gap-16");

      loggedIn.innerHTML = `
        <div class="profile-container flex flex-center gap-8">
          <a id="profile-link" href="/profile" class="profile nav-link" data-link>${nickname}</a>
          <img class="profile-avatar" src="${avatarURL}" alt="user profile picture" draggable="false">
        </div>
        <a id="settings-link" href="/settings" data-link class="settings flex flex-center nav-link">
          <img src="./Assets/icons/settings.svg" alt="settings icon" draggable="false">
        </a>
        <button id="logout" class="logout">
          <img src="./Assets/icons/logout.svg" alt="logout icon" draggable="false">
        </button>
      `;

      this.navBarElement?.appendChild(loggedIn);
    };

    if (authService.isUserAuthenticated())
      showLoggedInVersion(authService.userNick!, authService.userAvatar!);
    else
      showLoggedOutVersion();
  }

  /**
   * @brief Sets up event listeners for changing the application's language.
   * Switches language when a new language option is clicked and applies translations.
   */
  languageSelectorChangeEventListener(): void {
    const langs: NodeListOf<Element> = document.querySelectorAll(".lang-option");

    langs.forEach((langOption: Element) => {
      langOption.addEventListener("click", () => {
        const langOptionImg = langOption.querySelector("img") as HTMLImageElement | null;
        const currLang = document.querySelector(".current-language img[data-lang]") as HTMLImageElement | null;

        if (!langOptionImg || !currLang) return;

        // Swap image attributes
        const selectedSrc = langOptionImg.src;
        const selectedAlt = langOptionImg.alt;
        const selectedData = langOptionImg.dataset.lang;
        const currSrc = currLang.src;
        const currAlt = currLang.alt;
        const currData = currLang.dataset.lang;
        currLang.src = selectedSrc;
        currLang.alt = selectedAlt;
        currLang.dataset.lang = selectedData;
        langOptionImg.src = currSrc;
        langOptionImg.alt = currAlt;
        langOptionImg.dataset.lang = currData;

        // Update language
        translator.setLanguage(selectedData as LanguageCode);
        (document.querySelector(".lang-options") as HTMLElement).style.display = "none";
        translator.apply();
      });
    });
  }

  /**
   * @brief Initializes the language settings on page load by simulating a click
   * on the saved language option from local storage.
   */
  languageInit(): void {
    const lang = document.querySelector(
      `.lang-option img[data-lang="${localStorage.getItem("language")}"]`
    ) as HTMLElement;
    if (lang) lang.click();
  }
}


export const header = new Header();

// export const header = {
//   init() {
//     this.navBar = document.getElementById("header-nav");
//     this.logOutEventListener();
//     this.languageSelectorDisplayEventListener();
//     this.languageSelectorChangeEventListener();
//     this.languageInit();
//   },

//   logOutEventListener() {
//     if (!this.navBar) return;
//     this.navBar.addEventListener("click", (event) => {
//       event.preventDefault();
//       if (event.target.closest("#logout")) {
//         authService.logout();
//         console.log("DEBUG: LOGOUT!");
//         window.router.navigateTo("/");
//       }
//     });
//   },

//   createElement(element, id = null, classList = null) {
//     const newElement = document.createElement(element);

//     if (id) {
//       newElement.id = id;
//     }

//     if (classList) {
//       newElement.classList = classList;
//     }

//     return newElement;
//   },

//   async updateHeaderVisibility() {
//     let loggedOut = document.getElementById("log-reg");
//     let loggedIn = document.getElementById("user-in");

//     const showLoggedOutVersion = () => {
//       if (loggedIn) {
//         loggedIn.remove();
//       }

//       if (loggedOut) return;
//       loggedOut = this.createElement("div", "log-reg", "log-reg flex gap-24");

//       loggedOut.innerHTML = `
//         <a id="login-link" class="nav-link" href="/login" data-link data-i18n="header-login" >Login</a>
//         <a id="register-link" class="nav-link" href="/register" data-link data-i18n="header-register" >Register</a>
//         `;

//       this.navBar.appendChild(loggedOut);
//     };

//     const showLoggedInVersion = (nickname, avatarURL) => {
//       if (loggedOut) {
//         loggedOut.remove();
//       }
//       if (loggedIn) return;

//       loggedIn = this.createElement("div", "user-in", "user-in flex gap-16");

//       loggedIn.innerHTML = `
//           <div class="profile-container flex flex-center gap-8">
//           <a id="profile-link" href="/profile" class="profile nav-link" data-link>${nickname}</a>
//           <img class="profile-avatar" src="${avatarURL}" alt="user profile picture" draggable="false" >
//                 </div>
//                 <a id="settings-link" href="/settings" data-link class="settings flex flex-center nav-link">
//                   <img src="./Assets/icons/settings.svg" alt="settings icon" draggable="false" >
//                   </a>
//                   <button id="logout" class="logout">
//                   <img src="./Assets/icons/logout.svg" alt="logout icon" draggable="false" >
//                   </button>
//                   `;

//       this.navBar.appendChild(loggedIn);
//     };

//     if (authService.isUserAuthenticated())
//       showLoggedInVersion(authService.userNick, authService.userAvatar);
//     else showLoggedOutVersion();
//   },

//   languageSelectorDisplayEventListener() {
//     const dropDown = document.querySelector(".current-language");
//     const langList = document.querySelector(".lang-options");
//     if (!dropDown || !langList) return;

//     dropDown.addEventListener("click", (e) => {
//       e.preventDefault();

//       langList.style.display =
//         langList.style.display === "none" ? "block" : "none";
//     });
//   },

//   languageSelectorChangeEventListener() {
//     const langs = document.querySelectorAll(".lang-option");

//     langs.forEach((langOption) => {
//       langOption.addEventListener("click", () => {
//         const langOptionImg = langOption.querySelector("img");
//         const currLang = document.querySelector(
//           ".current-language img[data-lang]"
//         );

//         if (!langOptionImg || !currLang) return;

//         const selectedSrc = langOptionImg.src;
//         const selectedAlt = langOptionImg.alt;
//         const selectedData = langOptionImg.dataset.lang;
//         const currSrc = currLang.src;
//         const currAlt = currLang.alt;
//         const currData = currLang.dataset.lang;
//         currLang.src = selectedSrc;
//         currLang.alt = selectedAlt;
//         currLang.dataset.lang = selectedData;
//         langOptionImg.src = currSrc;
//         langOptionImg.alt = currAlt;
//         langOptionImg.dataset.lang = currData;

//         translator.setLanguage(selectedData);
//         document.querySelector(".lang-options").style.display = "none";
//         translator.apply();
//       });
//     });
//   },

//   languageInit() {
//     const lang = document.querySelector(
//       `.lang-option img[data-lang="${localStorage.getItem("language")}"]`
//     );
//     if (lang) lang.click();
//   },

//   updateActiveUnderline(path) {
//     const curActive = document.querySelector("a.nav-link.active");
//     const newActive = document.querySelector(`a.nav-link[href='${path}']`);

//     if (curActive && newActive && curActive !== newActive) {
//       curActive.classList.remove("active");
//       newActive.classList.add("active");
//     }
//   },
// };
