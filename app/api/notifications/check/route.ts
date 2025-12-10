import { prisma } from '@/lib/prisma';
import { getOrCreateDevice } from '@/lib/device';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const postIds = Array.isArray(body?.postIds) ? body.postIds.map((x: any) => String(x)) : [];
  const sinceStr = (body?.since || '').toString();
  const since = sinceStr ? new Date(sinceStr) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const device_id = await getOrCreateDevice();
  if (postIds.length === 0) return Response.json({ count: 0 });

  const count = await prisma.notification.count({
    where: { device_id, post_id: { in: postIds }, created_at: { gt: since } }
  });
  return Response.json({ count });
}
