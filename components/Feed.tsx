"use client";

import { useEffect, useState, useCallback } from 'react';
import PostItem, { Post } from './PostItem';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const onNew = (e: any) => {
      setPosts(p => [e.detail, ...p]);
    };
    window.addEventListener('post:created' as any, onNew);
    return () => window.removeEventListener('post:created' as any, onNew);
  }, [load]);

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {posts.map(p => (
        <PostItem key={p.post_id} post={p} />
      ))}
    </div>
  );
}
