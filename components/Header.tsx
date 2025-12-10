"use client";

import { useI18n } from './I18nProvider';
import LanguageToggle from './LanguageToggle';
import NotificationBadge from './NotificationBadge';

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="font-semibold">{t('logo')}</div>
        <div className="flex items-center gap-3">
          <NotificationBadge />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
