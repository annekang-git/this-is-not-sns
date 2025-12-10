import { prisma } from '@/lib/prisma';
import { validateComment } from '@/lib/validate';
import { sendToDevice } from '@/lib/sse';
import { getOrCreateDevice } from '@/lib/device';
import { checkRate } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const content = (body?.content || '').toString();
  const post_id = (body?.post_id || '').toString();

  if (!post_id) return new Response('post_id required', { status: 400 });
  const v = validateComment(content);
  if (!v.ok) return new Response('Invalid content', { status: 400 });

  // Rate limit by commenter device
  const deviceForRate = await getOrCreateDevice();
  const rl = checkRate(deviceForRate, 'comment');
  if (!rl.ok) return new Response('Rate limit', { status: 429 });

  const post = await prisma.post.findUnique({ where: { post_id }, select: { device_id: true } });
  if (!post) return new Response('Post not found', { status: 404 });

  const comment = await prisma.comment.create({
    data: { content: content.trim(), post_id },
    select: { comment_id: true, content: true, created_at: true }
  });

  if (post.device_id) {
    await prisma.notification.create({ data: { post_id, device_id: post.device_id, comment_id: comment.comment_id } });
    await sendToDevice(post.device_id, { type: 'comment', post_id, comment_id: comment.comment_id });
  }

  return Response.json(comment);
}
