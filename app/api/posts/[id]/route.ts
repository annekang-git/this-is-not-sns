import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const id = ctx.params.id;
  const post = await prisma.post.findUnique({
    where: { post_id: id },
    select: { post_id: true, content: true, created_at: true }
  });
  if (!post) return new Response('Not found', { status: 404 });
  const comments = await prisma.comment.findMany({
    where: { post_id: id },
    orderBy: { created_at: 'asc' },
    select: { comment_id: true, content: true, created_at: true }
  });
  return Response.json({ post, comments });
}
