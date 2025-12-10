"use client";

import { useI18n } from './I18nProvider';

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <button
      className="rounded border px-2 py-1 text-sm"
      onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
      aria-label="Toggle language"
    >
      {lang.toUpperCase()}
    </button>
  );
}
