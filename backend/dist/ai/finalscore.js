"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp01 = clamp01;
exports.distanceKm = distanceKm;
exports.locationScore = locationScore;
exports.timeScore = timeScore;
exports.attributeScore = attributeScore;
exports.calcFinalScore = calcFinalScore;
function clamp01(x) {
    return Math.max(0, Math.min(1, x));
}
// Haversine distance (km)
function distanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}
// 0..1: 0km=1, 10km=~0.37, 20km≈0.14 гэх мэт (exp decay)
function locationScore(latA, lngA, latB, lngB) {
    if (latA == null || lngA == null || latB == null || lngB == null)
        return 0.5; // location байхгүй бол neutral
    const d = distanceKm(latA, lngA, latB, lngB);
    const s = Math.exp(-d / 10); // 10км scale
    return clamp01(s);
}
// 0..1: 0 өдөр=1, 7 өдөр≈0.37, 30 өдөр≈0.014
function timeScore(dateA, dateB) {
    if (!dateA || !dateB)
        return 0.5;
    const a = new Date(dateA).getTime();
    const b = new Date(dateB).getTime();
    if (Number.isNaN(a) || Number.isNaN(b))
        return 0.5;
    const days = Math.abs(a - b) / (1000 * 60 * 60 * 24);
    const s = Math.exp(-days / 7); // 7 day scale
    return clamp01(s);
}
// 0..1
function attributeScore(a, b) {
    // petType, breed, gender ашиглая
    let total = 0;
    let hit = 0;
    const cmp = (x, y) => {
        total += 1;
        if (!x || !y)
            return; // unknown -> hit нэмэхгүй
        if (x.toLowerCase() === y.toLowerCase())
            hit += 1;
    };
    cmp(a === null || a === void 0 ? void 0 : a.petType, b === null || b === void 0 ? void 0 : b.petType);
    cmp(a === null || a === void 0 ? void 0 : a.gender, b === null || b === void 0 ? void 0 : b.gender);
    cmp(a === null || a === void 0 ? void 0 : a.breed, b === null || b === void 0 ? void 0 : b.breed);
    if (total === 0)
        return 0.5;
    // unknown их байвал score бага гарахгүй гэж neutral-р mix хийе
    const raw = hit / total;
    return clamp01(0.6 * raw + 0.4 * 0.5);
}
function calcFinalScore(params) {
    const image = clamp01(params.imageSim);
    const loc = clamp01(params.locSim);
    const time = clamp01(params.timeSim);
    const attr = clamp01(params.attrSim);
    // weight (production-д өөрчилж болно)
    const final = clamp01(image * 0.5 + loc * 0.25 + time * 0.15 + attr * 0.1);
    let status = "NO_MATCH";
    if (final >= 0.9)
        status = "EXACT";
    else if (final >= 0.75)
        status = "STRONG";
    else if (final >= 0.55)
        status = "POSSIBLE";
    return { final, status };
}
