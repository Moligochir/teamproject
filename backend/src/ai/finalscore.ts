type ScoreStatus = "NO_MATCH" | "POSSIBLE" | "STRONG" | "EXACT";

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// Haversine distance (km)
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

// 0..1: 0km=1, 10km=~0.37, 20km≈0.14 гэх мэт (exp decay)
export function locationScore(
  latA?: number,
  lngA?: number,
  latB?: number,
  lngB?: number,
) {
  if (latA == null || lngA == null || latB == null || lngB == null) return 0.5; // location байхгүй бол neutral

  const d = distanceKm(latA, lngA, latB, lngB);
  const s = Math.exp(-d / 10); // 10км scale
  return clamp01(s);
}

// 0..1: 0 өдөр=1, 7 өдөр≈0.37, 30 өдөр≈0.014
export function timeScore(dateA?: any, dateB?: any) {
  if (!dateA || !dateB) return 0.5;

  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0.5;

  const days = Math.abs(a - b) / (1000 * 60 * 60 * 24);
  const s = Math.exp(-days / 7); // 7 day scale
  return clamp01(s);
}

// 0..1
export function attributeScore(a: any, b: any) {
  // petType, breed, gender ашиглая
  let total = 0;
  let hit = 0;

  const cmp = (x?: string, y?: string) => {
    total += 1;
    if (!x || !y) return; // unknown -> hit нэмэхгүй
    if (x.toLowerCase() === y.toLowerCase()) hit += 1;
  };

  cmp(a?.petType, b?.petType);
  cmp(a?.gender, b?.gender);
  cmp(a?.breed, b?.breed);

  if (total === 0) return 0.5;
  // unknown их байвал score бага гарахгүй гэж neutral-р mix хийе
  const raw = hit / total;
  return clamp01(0.6 * raw + 0.4 * 0.5);
}

export function calcFinalScore(params: {
  imageSim: number; // 0..1
  locSim: number; // 0..1
  timeSim: number; // 0..1
  attrSim: number; // 0..1
}) {
  const image = clamp01(params.imageSim);
  const loc = clamp01(params.locSim);
  const time = clamp01(params.timeSim);
  const attr = clamp01(params.attrSim);

  // weight (production-д өөрчилж болно)
  const final = clamp01(image * 0.5 + loc * 0.25 + time * 0.15 + attr * 0.1);

  let status: ScoreStatus = "NO_MATCH";
  if (final >= 0.9) status = "EXACT";
  else if (final >= 0.75) status = "STRONG";
  else if (final >= 0.55) status = "POSSIBLE";

  return { final, status };
}
