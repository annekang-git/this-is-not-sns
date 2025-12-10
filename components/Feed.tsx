"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import PostItem, { Post } from './PostItem';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/posts?limit=${PAGE}&offset=0`);
    const data = await res.json();
    const list: Post[] = data.posts || [];
    setPosts(list);
    offsetRef.current = list.length;
    setHasMore(list.length === PAGE);
    setLoading(false);
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/posts?limit=${PAGE}&offset=${offsetRef.current}`);
      const data = await res.json();
      const list: Post[] = data.posts || [];
      if (list.length > 0) {
        setPosts(p => [...p, ...list]);
        offsetRef.current += list.length;
      }
      setHasMore(list.length === PAGE);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    load();
    const onNew = (e: any) => {
      setPosts(p => [e.detail, ...p]);
      // Keep offset aligned with backend offset pagination
      offsetRef.current += 1;
    };
    window.addEventListener('post:created' as any, onNew);
    return () => window.removeEventListener('post:created' as any, onNew);
  }, [load]);

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadMore();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, hasMore]);

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {posts.map(p => (
        <PostItem key={p.post_id} post={p} />
      ))}
      {!loading && posts.length === 0 && (
        <div className="text-sm text-gray-500">No posts yet</div>
      )}
      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} />
      {loadingMore && <div className="text-sm text-gray-500">Loading more...</div>}
      {!hasMore && posts.length > 0 && (
        <div className="py-4 text-center text-sm text-gray-400">No more posts</div>
      )}
    </div>
  );
}
