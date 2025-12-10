"use client";

import { useEffect, useState } from 'react';

const MIN = 100;
const MAX = 1000;

export default function Composer() {
  const [content, setContent] = useState('');
  const [noNotify, setNoNotify] = useState(false);
  const len = content.trim().length;
  const valid = len >= MIN && len <= MAX && !containsLinks(content);

  function containsLinks(text: string) {
    const r = /(https?:\/\/|www\.)|([a-z0-9-]{2,}\.[a-z]{2,})/i;
    return r.test(text);
  }

  const onSend = async () => {
    if (!valid) return;
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim(), notify: !noNotify })
    });
    if (!res.ok) return;
    const post = await res.json();
    setContent('');
    try {
      const ids = JSON.parse(localStorage.getItem('myPostIds') || '[]');
      ids.unshift(post.post_id);
      localStorage.setItem('myPostIds', JSON.stringify(ids.slice(0, 500)));
    } catch {}
    window.dispatchEvent(new CustomEvent('post:created', { detail: post }));
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' && !e.shiftKey)) {
        e.preventDefault();
        onSend();
      }
    };
    const ta = document.getElementById('composer') as HTMLTextAreaElement | null;
    ta?.addEventListener('keydown', handler);
    return () => ta?.removeEventListener('keydown', handler);
  }, [content, noNotify]);

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="mx-auto max-w-2xl px-4 py-3">
        <textarea
          id="composer"
          className="w-full resize-none rounded border p-3 outline-none focus:ring"
          rows={3}
          placeholder="Write 100–1000 characters. No photos, videos, or links. Share your honest thoughts."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="mt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={noNotify} onChange={e => setNoNotify(e.target.checked)} />
            <span>Do not notify me for this post</span>
          </label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{len} / {MAX} chars</span>
            <button
              onClick={onSend}
              disabled={!valid}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
