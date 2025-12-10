"use client";

import { useState } from 'react';
import { useI18n } from './I18nProvider';

export default function TranslateButton({ postId }: { postId: string }) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translated, setTranslated] = useState<string | null>(null);

  const onClick = async () => {
    if (open) { setOpen(false); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/translate?post_id=${postId}&lang=${lang}`);
      if (r.ok) {
        const j = await r.json();
        setTranslated(j.translated || null);
      }
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  return (
    <div className="inline">
      <button className="underline" onClick={onClick} disabled={loading}>
        {loading ? '...' : 'Translate'}
      </button>
      {open && translated && (
        <div className="mt-2 text-sm text-gray-700">{translated}</div>
      )}
    </div>
  );
}
