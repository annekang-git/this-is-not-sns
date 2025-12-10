"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '@/locales/en.json';
import ko from '@/locales/ko.json';

type Lang = 'en' | 'ko';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
};

const C = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (stored === 'ko' || stored === 'en') setLangState(stored);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
  };
  const dict = lang === 'ko' ? ko : en;
  const t = useMemo(() => {
    return (k: string) => (dict as any)[k] ?? k;
  }, [dict]);
  return <C.Provider value={{ lang, setLang, t }}>{children}</C.Provider>;
}

export function useI18n() {
  const c = useContext(C);
  if (!c) throw new Error('I18n missing');
  return c;
}
