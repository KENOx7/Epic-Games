import { create } from "zustand";
import translations from "../translations.json";

export const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem("epic_lang") || "en",
  
  setLanguage: (lang) => {
    localStorage.setItem("epic_lang", lang);
    set({ language: lang });
  },
  
  t: (key) => {
    const lang = get().language;
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  },
}));
