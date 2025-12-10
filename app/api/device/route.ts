import { getOrCreateDevice } from '@/lib/device';

export async function GET() {
  const device_id = await getOrCreateDevice();
  return Response.json({ device_id });
}
