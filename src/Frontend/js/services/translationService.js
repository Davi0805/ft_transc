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
        return this.translations[this.currentLang]?.[key] || key;
    }

    apply() {
        const contents = document.querySelectorAll('[data-i18n]');
        if (!contents) return;
        contents.forEach( content => {
            const key = content.getAttribute('data-i18n');
            content.textContent = this.get(key);
        });
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        if (!placeholders) return;
        placeholders.forEach(ph => {
            const key = ph.getAttribute('data-i18n-placeholder');
            ph.setAttribute('placeholder', this.get(key));
        });
        const inputTitles = document.querySelectorAll('[data-i18n-titles]');
        if (!placeholders) return;
        placeholders.forEach(titles => {
            const key = titles.getAttribute('data-i18n-title');
            if (key) titles.setAttribute('title', this.get(key));
        });
    }
}

export const translator = new translationService(languages);
