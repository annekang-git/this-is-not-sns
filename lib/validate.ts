export function containsLinks(text: string) {
  const r = /(https?:\/\/|www\.)|([a-z0-9-]{2,}\.[a-z]{2,})/i;
  return r.test(text);
}

export function validatePost(content: string): { ok: boolean; reason?: string } {
  const t = content.trim();
  if (t.length < 100 || t.length > 200) return { ok: false, reason: 'length' };
  if (containsLinks(t)) return { ok: false, reason: 'links' };
  return { ok: true };
}

export function validateComment(content: string): { ok: boolean; reason?: string } {
  const t = content.trim();
  if (t.length < 1 || t.length > 1000) return { ok: false, reason: 'length' };
  if (containsLinks(t)) return { ok: false, reason: 'links' };
  return { ok: true };
}
