import { authService } from "../services/authService.js";
import { translator } from "../services/translationService.js";

export const header = {
    init() {
        this.logOutEventListener();
        this.languageSelectorDisplayEventListener();
        this.languageSelectorChangeEventListener();
        this.languageInit();
    },

    logOutEventListener() {
        const logout = document.getElementById("logout");
        if (!logout) return;

        logout.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
            console.log("DEBUG: LOGOUT!");
            window.router.navigateTo('/');
        });
    },

    languageSelectorDisplayEventListener() {
        const dropDown = document.querySelector('.current-language');
        const langList = document.querySelector('.lang-options');
        if (!dropDown || !langList) return ;

        dropDown.addEventListener('click', (e) => {
            e.preventDefault();
            
            langList.style.display = langList.style.display === "none" ? "block" : "none";
        });
    },

    languageSelectorChangeEventListener() {
        const langs = document.querySelectorAll('.lang-option');
        

        langs.forEach((langOption) => {
            langOption.addEventListener('click', () => {
                const langOptionImg = langOption.querySelector('img');
                const currLang = document.querySelector('.current-language img[data-lang]');

                if (!langOptionImg || ! currLang) return;

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

                translator.setLanguage(selectedData)
                document.querySelector('.lang-options').style.display = 'none';
                translator.apply();
            });
        });
    },

    languageInit() {
        const lang = document.querySelector(`.lang-option img[data-lang="${localStorage.getItem('language')}"]`);
        if (lang)
            lang.click();
    },

    updateActiveUnderline(path) {
        const curActive = document.querySelector('a.nav-link.active');
        const newActive = document.querySelector(`a.nav-link[href='${path}']`);

        if (curActive && newActive && curActive !== newActive) {
            curActive.classList.remove('active');
            newActive.classList.add('active');
        }
    }
}