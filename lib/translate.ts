export async function translateText(text: string, target: 'en' | 'ko'): Promise<string> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return text; // no-op if not configured
  const target_lang = target === 'en' ? 'EN' : 'KO';

  const params = new URLSearchParams();
  params.set('auth_key', key);
  params.set('text', text);
  params.set('target_lang', target_lang);

  // Try free endpoint first, then paid
  const endpoints = [
    'https://api-free.deepl.com/v2/translate',
    'https://api.deepl.com/v2/translate'
  ];
  for (const url of endpoints) {
    try {
      const r = await fetch(url, { method: 'POST', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      if (!r.ok) continue;
      const j = await r.json();
      const out = j?.translations?.[0]?.text;
      if (typeof out === 'string' && out.length > 0) return out;
    } catch {}
  }
  return text;
}
