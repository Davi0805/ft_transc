import { authService } from "../services/authService";
import { translator } from "../services/translationService";
import { router } from "../routes/router";

class Header {
  private navBarElement: HTMLElement | null;

  constructor() {
    this.navBarElement = document.getElementById("header-nav");
    this.logOutEventListener();
    this.languageSelectorDisplayEventListener();
    this.languageSelectorChangeEventListener();
    this.languageInit();
  }

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

  updateActiveUnderline(path: string): void {
    const curActive = document.querySelector(
      "a.nav-link.active"
    ) as HTMLElement;
    const newActive = document.querySelector(
      `a.nav-link[href='${path}']`
    ) as HTMLElement;

    if (curActive && newActive && curActive !== newActive) {
      curActive.classList.remove("active");
      newActive.classList.add("active");
    }
  }

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

  updateHeaderVisibility(): void {
    let loggedOut = document.getElementById("log-reg") as HTMLElement;
    let loggedIn = document.getElementById("user-in") as HTMLElement;

    const showLoggedOutVersion = () => {
      if (loggedIn) {
        loggedIn.remove();
      }

      if (loggedOut) return;
      loggedOut = this.createElement("div", "log-reg", "log-reg flex gap-24");

      loggedOut.innerHTML = `
        <a id="login-link" class="nav-link" href="/login" data-link data-i18n="header-login" >Login</a>
        <a id="register-link" class="nav-link" href="/register" data-link data-i18n="header-register" >Register</a>
        `;

      this.navBarElement?.appendChild(loggedOut);
    };

    const showLoggedInVersion = (
      nickname: string,
      avatarURL: string
    ) => {
      if (loggedOut) {
        loggedOut.remove();
      }
      if (loggedIn) return;

      loggedIn = this.createElement("div", "user-in", "user-in flex gap-16");

      loggedIn.innerHTML = `
          <div class="profile-container flex flex-center gap-8">
          <a id="profile-link" href="/profile" class="profile nav-link" data-link>${nickname}</a>
          <img class="profile-avatar" src="${avatarURL}" alt="user profile picture" draggable="false" >
                </div>
                <a id="settings-link" href="/settings" data-link class="settings flex flex-center nav-link">
                  <img src="./Assets/icons/settings.svg" alt="settings icon" draggable="false" >
                  </a>
                  <button id="logout" class="logout">
                  <img src="./Assets/icons/logout.svg" alt="logout icon" draggable="false" >
                  </button>
                  `;

      this.navBarElement?.appendChild(loggedIn);
    };

    if (authService.isUserAuthenticated())
      showLoggedInVersion(authService.userNick!, authService.userAvatar!);
    else showLoggedOutVersion();
  }

  languageSelectorChangeEventListener(): void {
    const langs: NodeListOf<Element> =
      document.querySelectorAll(".lang-option");

    langs.forEach((langOption: Element) => {
      langOption.addEventListener("click", () => {
        const langOptionImg = langOption.querySelector(
          "img"
        ) as HTMLImageElement | null;
        const currLang = document.querySelector(
          ".current-language img[data-lang]"
        ) as HTMLImageElement | null;

        if (!langOptionImg || !currLang) return;

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

        translator.setLanguage(selectedData);
        (document.querySelector(".lang-options") as HTMLElement).style.display =
          "none";
        translator.apply();
      });
    });
  }

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
