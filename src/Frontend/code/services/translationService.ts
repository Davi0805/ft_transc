import {
  languages,
  Languages,
  LanguageCode,
  LanguageStrings,
} from "../languages/languages";

class translationService {
  private translations: Languages;
  private currentLang: LanguageCode;

  constructor() {
    this.translations = languages;
    this.currentLang =
      (localStorage.getItem("language") as LanguageCode) ||
      ("uk" as LanguageCode);
  }

  setLanguage(lang: LanguageCode): void {
    if (lang in this.translations) {
      this.currentLang = lang;
      localStorage.setItem("language", lang);
      this.apply();
    } else {
      console.warn("DEBUG: Language " + lang + " not found");
    }
  }

  get(key: keyof LanguageStrings): string {
    return this.translations[this.currentLang][key];
  }

  apply(): void {
    const contents = document.querySelectorAll<HTMLElement>("[data-i18n]");
    contents.forEach((content) => {
      const key = content.getAttribute("data-i18n") as keyof LanguageStrings;
      if (key && this.translations[this.currentLang][key])
        content.textContent = this.get(key);
    });

    const placeholders = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-i18n-placeholder]");
    placeholders.forEach((element) => {
      const key = element.getAttribute(
        "data-i18n-placeholder"
      ) as keyof LanguageStrings;
      if (key && this.translations[this.currentLang][key])
        element.placeholder = this.get(key);
    });

    //todo fix
    const inputTitles =
      document.querySelectorAll<HTMLElement>("[data-i18n-title]");
    inputTitles.forEach((element) => {
      const key = element.getAttribute(
        "data-i18n-title"
      ) as keyof LanguageStrings;
      if (key && this.translations[this.currentLang][key])
        element.title = this.get(key);
    });
  }
}

export const translator = new translationService();
