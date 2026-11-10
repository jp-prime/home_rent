/**
 * Calculates the great-circle distance between two points on the Earth (Haversine formula).
 * Returns distance in kilometers (km).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(km?: number): string {
  if (km === undefined) return '';
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Format Korean currency amount in 만원 to readable Korean text.
 * e.g., 85000 -> 8억 5,000만원, 1000 -> 1,000만원
 */
export function formatKoreanPrice(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const remainder = manwon % 10000;
    if (remainder === 0) {
      return `${eok}억원`;
    }
    return `${eok}억 ${remainder.toLocaleString()}만원`;
  }
  return `${manwon.toLocaleString()}만원`;
}
