import { languages } from "../languages/languages.js";

class translationService {
    constructor(translations, defaultLang = "uk"){
        this.translations = translations;
        this.currentLang = localStorage.getItem('language') || defaultLang;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.apply();
        }
        else
        {
            console.warn("DEBUG: Language " + lang  + " not found");
        }
    }

    get(key) {
        return this.translations[this.currentLang]?.[key];
    }

    apply() {
        const contents = document.querySelectorAll('[data-i18n]');
        if (!contents) return;
        contents.forEach( content => {
            const key = content.getAttribute('data-i18n');
            const value = this.get(key);
            if (key && value) content.textContent = value;
        });
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        if (!placeholders) return;
        placeholders.forEach(ph => {
            const key = ph.getAttribute('data-i18n-placeholder');
            const value = this.get(key);
            if (key && value) ph.setAttribute('placeholder', this.get(key));
        });
        //todo fix
        const inputTitles = document.querySelectorAll('[data-i18n-title]');
        if (!inputTitles) return;
        inputTitles.forEach(titles => {
            const key = titles.getAttribute('data-i18n-title');
            const value = this.get(key);
            if (key && value) titles.setAttribute('title', this.get(key));
        });
    }
}

export const translator = new translationService(languages);
