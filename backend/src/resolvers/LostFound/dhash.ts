import jpeg from "jpeg-js";
import { PNG } from "pngjs";

type Decoded = { data: Uint8Array; width: number; height: number };

function decodeImage(buf: Buffer): Decoded {
  // JPEG
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) {
    const decoded = jpeg.decode(buf, { useTArray: true });
    if (!decoded?.data) throw new Error("Failed to decode JPEG");
    return { data: decoded.data, width: decoded.width, height: decoded.height };
  }

  // PNG
  const isPng =
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a;

  if (isPng) {
    const png = PNG.sync.read(buf);
    return { data: png.data, width: png.width, height: png.height };
  }

  throw new Error("Unsupported image format (only JPEG/PNG supported)");
}

function resizeToGrayscale32(decoded: Decoded, size = 32): number[] {
  const { data, width, height } = decoded;
  const out: number[] = new Array(size * size);

  for (let y = 0; y < size; y++) {
    const sy = Math.floor((y * height) / size);
    for (let x = 0; x < size; x++) {
      const sx = Math.floor((x * width) / size);
      const idx = (sy * width + sx) * 4;

      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;

      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      out[y * size + x] = gray;
    }
  }
  return out;
}

function aHashFromGray(gray: number[]): string {
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;

  let bits = "";
  for (const p of gray) bits += p > avg ? "1" : "0";

  let hex = "";
  for (let i = 0; i < bits.length; i += 4) {
    hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  }
  return hex;
}

export async function getImageHash(imageUrl: string): Promise<string> {
  const r = await fetch(imageUrl);
  if (!r.ok) throw new Error(`Image fetch failed: ${r.status}`);

  const buf = Buffer.from(await r.arrayBuffer());
  const decoded = decodeImage(buf);
  const gray = resizeToGrayscale32(decoded, 32);

  return aHashFromGray(gray); // 256 hex chars
}

export function hamming(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let d = 0;
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) d++;
  return d + Math.abs(a.length - b.length);
}
