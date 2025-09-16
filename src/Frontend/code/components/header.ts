import { authService } from "../services/authService";
import { translator } from "../services/translationService";
import { router } from "../routes/router";
import { LanguageCode } from "../languages/languages";
import { WarningPopup } from "../utils/popUpWarn";

/**
 * @class Header
 * @brief Handles the application's header logic, including navigation updates,
 * language switching, and header-authentication-related UI updates.
 */
class Header {
  private navBarElement: HTMLElement | null = null;

  createHeaderElement(): void {
    const headerElement = document.createElement("header");
    headerElement.id = "header";
    headerElement.className = "fixed top-0 left-0 right-0 z-10 h-[60px] py-2 px-6 \
                              flex gap-6 bg-[#172332] border-b-2 border-b-[#00000066]";
    headerElement.innerHTML = `
      <div class="flex items-center justify-center flex-none">
        <a href="/" class="flex items-center justify-center gap-2" data-link>
          <img
            class="mr-6 h-10 w-auto"
            src="../../Assets/42PortoLogo.png"
            alt="42 Porto logo"
            draggable="false"
          />
          <span class="text-xl font-bold text-white">ft_transcendence</span>
        </a>
      </div>

      <div class="flex items-center justify-end flex-1 gap-4 ">
        <nav id="header-nav" class="flex items-center justify-center gap-6">
          <a
            id="home-link"
            href="/"
            data-link
            data-i18n="header-home"
            class="active nav-link"
            >Home</a
          >
          <a 
            id="play-link"
            href="/play"
            data-link
            data-i18n="header-play"
            class="nav-link"
            >Play</a
          >

          <!-- <div id="log-reg" class="log-reg flex gap-24"></div>

        <div id="user-in" class="user-in flex gap-16"></div> -->
        </nav>

        <div class="language-selector flex flex-col justify-center items-center relative">
          <button class="current-language flex justify-center items-center">
            <img
              src="https://flagcdn.com/w20/gb.png"
              class="h-3 w-5 rounded-sm overflow-hidden hover:scale-125 transition-all duration-200 ease-in-out"
              data-lang="uk"
              alt="United Kingdom flag"
              draggable="false"
            />
            <img
              class="h-5 w-5 rounded-lg overflow-hidden"
              src="../../Assets/icons/drop-down.svg"
              alt="drop-down icon flag"
              draggable="false"
            />
          </button>

          <div class="lang-options absolute -left-1 top-full w-10 rounded-md bg-[rgb(23,35,50)] border-2 border-black/40" style="display: none">
            <ul class="flex flex-col justify-center items-center">
              <li>
                <button class="lang-option">
                  <img
                    src="https://flagcdn.com/w20/pt.png"
                    data-lang="pt"
                    alt="Portuguese flag"
                    draggable="false"
                  />
                </button>
              </li>

              <li>
                <button class="lang-option">
                  <img
                    src="https://flagcdn.com/w20/es.png"
                    data-lang="es"
                    alt="Spain flag"
                    flag
                    draggable="false"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      `;

    document.body.insertAdjacentElement('afterbegin', headerElement);
  }

  init() {
    
    this.createHeaderElement();
    
    this.navBarElement = document.getElementById("header-nav");
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
    if (!this.navBarElement) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the header could not be found..."
      );
      return;
    }
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
    if (!dropDown || !langList) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the language selector could not be found..."
      );
      return;
    }

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
      loggedOut = this.createElement("div", "log-reg", "log-reg flex gap-6");

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

      loggedIn = this.createElement("div", "user-in", "user-in flex gap-4");

      loggedIn.innerHTML = `
        <a id="profile-link" href="/profile" class="flex justify-center items-center gap-4 nav-link  transition-all duration-200 ease-in-out" data-link>
          <span>${nickname}</span>
          <img class="profile-avatar w-8 h-8 rounded-full border-2 border-white shadow-md shadow-[#333]" src="${avatarURL}" alt="user profile picture" draggable="false">
        </a>
        <a id="settings-link" href="/settings" data-link class="settings flex justify-center items-center nav-link">
          <img class="w-6 h-6 hover:scale-125 transition-all duration-200 ease-in-out" src="./Assets/icons/settings.svg" alt="settings icon" draggable="false">
        </a>
        <button id="logout" class="logout flex justify-center items-center">
          <img class="w-6 h-6 hover:scale-125 transition-all duration-200 ease-in-out" src="./Assets/icons/logout.svg" alt="logout icon" draggable="false">
        </button>
      `;

      this.navBarElement?.appendChild(loggedIn);
    };

    if (authService.isUserAuthenticated())
      showLoggedInVersion(authService.userNick!, authService.userAvatar!);
    else showLoggedOutVersion();
  }

  /**
   * @brief Sets up event listeners for changing the application's language.
   * Switches language when a new language option is clicked and applies translations.
   */
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
        (document.querySelector(".lang-options") as HTMLElement).style.display =
          "none";
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
