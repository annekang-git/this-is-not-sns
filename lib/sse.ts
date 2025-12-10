const g = globalThis as unknown as {
  __subs?: Map<string, Set<WritableStreamDefaultWriter<Uint8Array>>>;
};

const subs = g.__subs ?? new Map<string, Set<WritableStreamDefaultWriter<Uint8Array>>>();
if (!g.__subs) g.__subs = subs;

const enc = new TextEncoder();

export function subscribe(deviceId: string, writer: WritableStreamDefaultWriter<Uint8Array>) {
  let set = subs.get(deviceId);
  if (!set) { set = new Set(); subs.set(deviceId, set); }
  set.add(writer);
}

export function unsubscribe(deviceId: string, writer: WritableStreamDefaultWriter<Uint8Array>) {
  const set = subs.get(deviceId);
  if (set) {
    set.delete(writer);
    if (set.size === 0) subs.delete(deviceId);
  }
}

export async function sendToDevice(deviceId: string, data: any) {
  const set = subs.get(deviceId);
  if (!set) return;
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const w of set) {
    try { await w.write(enc.encode(payload)); } catch {}
  }
}
