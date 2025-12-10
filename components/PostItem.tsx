"use client";

import { useState } from 'react';
import CommentThread from './CommentThread';

export type Post = {
  post_id: string;
  content: string;
  created_at: string;
};

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

export default function PostItem({ post }: { post: Post }) {
  const [show, setShow] = useState(false);
  return (
    <article className="rounded border p-4">
      <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div>{timeAgo(post.created_at)}</div>
        <div className="flex items-center gap-3">
          <button className="underline" onClick={() => setShow(v => !v)}>
            {show ? 'Hide' : 'Comments'}
          </button>
        </div>
      </div>
      {show && <CommentThread postId={post.post_id} />}
    </article>
  );
}
