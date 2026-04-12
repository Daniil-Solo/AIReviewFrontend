export const paramsSerialize = (paramsObj: Record<string, unknown>): string => {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(paramsObj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      }
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.join('&');
};