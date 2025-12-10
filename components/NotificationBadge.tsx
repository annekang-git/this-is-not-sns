"use client";

import { useEffect, useRef, useState } from 'react';

export default function NotificationBadge() {
  const [count, setCount] = useState(0);
  const connected = useRef(false);

  useEffect(() => {
    fetch('/api/device').then(async r => {
      await r.json();
      const now = new Date().toISOString();
      const since = localStorage.getItem('lastCheckedAt') || now;
      const ids = JSON.parse(localStorage.getItem('myPostIds') || '[]');
      fetch('/api/notifications/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postIds: ids, since })
      })
        .then(r => r.json())
        .then(j => {
          if (j && typeof j.count === 'number') setCount(c => c + j.count);
        })
        .finally(() => {
          localStorage.setItem('lastCheckedAt', now);
        });

      if (!connected.current) {
        const es = new EventSource('/api/stream');
        es.onmessage = ev => {
          try {
            const data = JSON.parse(ev.data);
            if (data.type === 'comment') setCount(c => c + 1);
          } catch {}
        };
        es.onerror = () => {};
        connected.current = true;
      }
    });
  }, []);

  if (count <= 0) return <div className="text-xs text-gray-400">0</div>;
  return (
    <div className="inline-flex min-w-6 items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
      {count}
    </div>
  );
}
