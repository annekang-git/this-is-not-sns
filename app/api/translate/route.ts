import { prisma } from '@/lib/prisma';
import { translateText } from '@/lib/translate';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const post_id = (searchParams.get('post_id') || '').toString();
  const lang = (searchParams.get('lang') || 'en').toString();
  if (!post_id) return new Response('post_id required', { status: 400 });
  if (!['en', 'ko'].includes(lang)) return new Response('unsupported lang', { status: 400 });

  const post = await prisma.post.findUnique({ where: { post_id }, select: { content: true } });
  if (!post) return new Response('Not found', { status: 404 });

  const cached = await prisma.postTranslation.findUnique({ where: { post_id_target_lang: { post_id, target_lang: lang } } });
  if (cached) return Response.json({ translated: cached.translated });

  const translated = await translateText(post.content, lang as 'en' | 'ko');
  await prisma.postTranslation.create({ data: { post_id, target_lang: lang, translated } });
  return Response.json({ translated });
}
