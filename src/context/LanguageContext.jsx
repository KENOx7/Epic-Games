import React, { createContext, useState, useEffect } from "react";
import translations from "../translations.json";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("epic_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("epic_lang", language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
