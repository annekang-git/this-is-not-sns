import { prisma } from '@/lib/prisma';
import { getOrCreateDevice } from '@/lib/device';
import { validatePost } from '@/lib/validate';
import { checkRate } from '@/lib/rateLimit';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
  const posts = await prisma.post.findMany({
    orderBy: { created_at: 'desc' },
    take: limit,
    select: { post_id: true, content: true, created_at: true }
  });
  return Response.json({ posts });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const content = (body?.content || '').toString();
  const notify = Boolean(body?.notify ?? true);

  const v = validatePost(content);
  if (!v.ok) return new Response('Invalid content', { status: 400 });
  // Always derive device for rate limiting
  const deviceForRate = await getOrCreateDevice();
  const rl = checkRate(deviceForRate, 'post');
  if (!rl.ok) return new Response('Rate limit', { status: 429 });

  let device_id: string | null = null; // attach to post only when notify is true
  if (notify) device_id = deviceForRate;

  const post = await prisma.post.create({
    data: { content: content.trim(), device_id },
    select: { post_id: true, content: true, created_at: true }
  });
  return Response.json(post);
}
