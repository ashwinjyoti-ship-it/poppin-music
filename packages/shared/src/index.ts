export function createId(prefix: string): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${stamp}_${rand}`;
}

export function logLine(
  scope: string,
  message: string,
  extra?: Record<string, unknown>,
): string {
  const time = new Date().toISOString();
  const payload = extra ? ` ${JSON.stringify(extra)}` : "";
  return `[${time}] [${scope}] ${message}${payload}`;
}

export function parseBarsFromIntention(intention: string, fallback = 8): number {
  const match = intention.match(/(\d+)\s*bars?/i);
  if (!match?.[1]) return fallback;
  const n = Number.parseInt(match[1], 10);
  if (!Number.isFinite(n) || n < 1 || n > 32) return fallback;
  return n;
}
