import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';

export async function getOrCreateDevice(): Promise<string> {
  const c = cookies();
  let id = c.get('tin_device')?.value;
  const secure = process.env.NODE_ENV === 'production';
  if (!id) {
    id = uuidv4();
    c.set('tin_device', id, { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 60 * 60 * 24 * 365 });
    try { await prisma.device.create({ data: { device_id: id } }); } catch {}
  } else {
    try { await prisma.device.upsert({ where: { device_id: id }, update: {}, create: { device_id: id } }); } catch {}
  }
  return id;
}
