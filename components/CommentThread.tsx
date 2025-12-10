"use client";

import { useEffect, useMemo, useState } from 'react';
import { containsLinks } from '@/lib/validate';

type Comment = { comment_id: string; content: string; created_at: string };

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function CommentThread({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => {
    const t = content.trim();
    if (t.length < 1 || t.length > 1000) return false;
    if (containsLinks(t)) return false;
    return true;
  }, [content]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(`/api/posts/${postId}`);
        const j = await r.json();
        if (mounted) setComments(j.comments || []);
      } catch {}
    })();
    return () => { mounted = false; };
  }, [postId]);

  const send = async () => {
    if (!valid) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content: content.trim() })
      });
      if (!r.ok) throw new Error('failed');
      const c = await r.json();
      setComments((cur) => (cur ? [...cur, c] : [c]));
      setContent('');
    } catch (e: any) {
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      {comments === null && <div className="text-xs text-gray-500">Loading comments...</div>}
      {Array.isArray(comments) && comments.length === 0 && (
        <div className="text-xs text-gray-400">No comments yet</div>
      )}
      {Array.isArray(comments) && comments.map(c => (
        <div key={c.comment_id} className="rounded border p-2">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{c.content}</div>
          <div className="mt-1 text-[10px] text-gray-500">{timeAgo(c.created_at)}</div>
        </div>
      ))}
      <div>
        <textarea
          className="w-full resize-none rounded border p-2 text-sm outline-none focus:ring"
          rows={3}
          placeholder="Write a thoughtful comment (max 1000)"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-gray-500">{content.trim().length} / 1000</div>
          <button
            className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
            disabled={!valid || loading}
            onClick={send}
          >
            {loading ? '...' : 'Comment'}
          </button>
        </div>
        {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      </div>
    </div>
  );
}
