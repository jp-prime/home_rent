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
export function formatKoreanPrice(val?: number | string): string {
  if (val === undefined || val === null || val === '') return '';
  if (typeof val === 'string') {
    return val;
  }
  if (val >= 10000) {
    const eok = Math.floor(val / 10000);
    const remainder = val % 10000;
    if (remainder === 0) {
      return `${eok}억원`;
    }
    return `${eok}억 ${remainder.toLocaleString()}만원`;
  }
  return `${val.toLocaleString()}만원`;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// 호치민 주요 아파트 단지 및 동네별 스마트 기준 좌표 사전
const HCM_LANDMARK_COORDS: { keywords: string[]; coords: Coordinates }[] = [
  // 7군 냐베 & 사데코 (Phước Kiển)
  {
    keywords: ['냐베', 'nha be', 'nhà bè', 'sadeco', '사데코', 'phuoc kien', 'phước kiển'],
    coords: { lat: 10.7180, lng: 106.7130 },
  },
  // 7군 푸미흥 & 주요 아파트
  {
    keywords: [
      '푸미흥', 'phu my hung', 'phú mỹ hưng',
      '스카이가든', 'sky garden', '미드타운', 'midtown',
      '시닉밸리', 'scenic', '해피밸리', 'happy valley',
      '선라이즈', 'sunrise', '리버파크', 'riverpark',
      '7군', 'quan 7', 'quận 7', 'tan phong', 'tân phong'
    ],
    coords: { lat: 10.7295, lng: 106.7092 },
  },
  // 2군 타오디엔
  {
    keywords: [
      '타오디엔', 'thao dien', 'thảo điền',
      '마스테리', 'masteri', '게이트웨이', 'gateway',
      '나심', 'nassim', 'q2 thier', '디에지', 'the edge'
    ],
    coords: { lat: 10.8035, lng: 106.7381 },
  },
  // 2군 안푸
  {
    keywords: [
      '안푸', 'an phu', 'an phú',
      '에스텔라', 'estella', '칸타빌', 'cantavil',
      '임페리아', 'imperia', '렉싱턴', 'lexington',
      '2군', 'quan 2', 'quận 2'
    ],
    coords: { lat: 10.8010, lng: 106.7440 },
  },
  // 투티엠 신도시
  {
    keywords: [
      '투티엠', 'thu thiem', 'thủ thiêm',
      '살라', 'sala', '메트로폴', 'metropole',
      '엠파이어', 'empire city'
    ],
    coords: { lat: 10.7720, lng: 106.7180 },
  },
  // 빈탄군 (랜드마크 81, 빈홈 센트럴파크)
  {
    keywords: [
      '빈홈', 'vinhomes', '랜드마크', 'landmark',
      '센트럴파크', 'central park', '빈탄', 'binh thanh', 'bình thạnh'
    ],
    coords: { lat: 10.7950, lng: 106.7218 },
  },
  // 1군 (벤탄, 시내, 레탄똔)
  {
    keywords: [
      '1군', 'quan 1', 'quận 1',
      '벤탄', 'ben thanh', 'bến thành',
      '레탄똔', 'le thanh ton', '다카오', 'da kao'
    ],
    coords: { lat: 10.7769, lng: 106.7009 },
  },
  // 4군
  {
    keywords: ['4군', 'quan 4', 'quận 4', '골드뷰', 'gold view', '더트레저'],
    coords: { lat: 10.7600, lng: 106.7030 },
  },
  // 3군
  {
    keywords: ['3군', 'quan 3', 'quận 3'],
    coords: { lat: 10.7830, lng: 106.6850 },
  },
];

/**
 * 주소, 상세주소, 지역명 텍스트에서 호치민 주요 랜드마크 키워드를 찾아 좌표를 자동으로 반환합니다.
 */
export function findCoordinatesFromAddress(text?: string): Coordinates | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const item of HCM_LANDMARK_COORDS) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.coords;
    }
  }
  return null;
}
