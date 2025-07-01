"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1 text-sm border rounded-full hover:bg-gray-100 transition"
      title="Switch language"
    >
      {lang === "en" ? (
        <>
          🇬🇧 <span className="hidden sm:inline">EN</span>
        </>
      ) : (
        <>
          🇫🇷 <span className="hidden sm:inline">FR</span>
        </>
      )}
    </button>
  );
}
