"use client";

import NotificationBadge from './NotificationBadge';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="font-semibold">This Is Not SNS</div>
        <div className="flex items-center gap-3">
          <NotificationBadge />
        </div>
      </div>
    </header>
  );
}
