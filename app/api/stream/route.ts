import { getOrCreateDevice } from '@/lib/device';
import { subscribe, unsubscribe } from '@/lib/sse';

export const runtime = 'nodejs';

export async function GET() {
  const device_id = await getOrCreateDevice();

  const ts = new TransformStream();
  const writer = ts.writable.getWriter();
  const enc = new TextEncoder();

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  });

  // Hello event
  await writer.write(enc.encode(`data: ${JSON.stringify({ type: 'hello', device_id })}\n\n`));

  subscribe(device_id, writer);

  const interval = setInterval(() => {
    writer.write(enc.encode(`: ping\n\n`)).catch(() => {});
  }, 15000);

  const stream = new ReadableStream({
    start(controller) {
      const reader = ts.readable.getReader();
      const pump = () => reader.read().then(({ done, value }) => {
        if (done) { controller.close(); return; }
        controller.enqueue(value!);
        pump();
      });
      pump();
    },
    cancel() {
      clearInterval(interval);
      unsubscribe(device_id, writer);
      writer.close().catch(() => {});
    }
  });

  return new Response(stream, { headers });
}
