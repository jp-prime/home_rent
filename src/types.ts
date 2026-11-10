export type PropertyCategory = '전체' | '아파트' | '빌라' | '원룸' | '오피스텔' | '건물';

export type SpecificCategory = '아파트' | '빌라' | '원룸' | '오피스텔' | '건물';

export type TransactionType = '전체' | '월세' | '전세' | '매매';

export interface AgentContact {
  name: string;
  agencyName: string;
  kakaoId: string;
  zaloPhone: string;
  phone: string;
  verified: boolean;
  avatar?: string;
}

export interface Property {
  id: string;
  category: SpecificCategory;
  transactionType: '월세' | '전세' | '매매';
  district: string; // e.g. "호치민 1군", "호치민 2군", "호치민 7군", "호치민 빈탄군"
  title: string;
  deposit: number; // in 만원 or USD / converted
  monthlyRent?: number; // in 만원 or USD / converted
  priceLabel: string; // e.g. "월세 $1,200 (약 160만)" or "월세 1,000 / 95"
  shortPrice: string; // e.g. "$1,200/월", "1000/95"
  address: string;
  detailedAddress?: string;
  region: string; // e.g. "호치민시 1군 벤타인"
  lat: number;
  lng: number;
  areaPyeong: number; // 평
  areaM2: number; // m²
  floor: string; // e.g. "12층 / 25층"
  roomCount: string; // e.g. "방 2 · 욕실 2"
  direction?: string; // e.g. "남동향 (사이공강 뷰)"
  maintenanceFee: number; // 만원 (또는 USD)
  maintenanceFeeIncludes: string[];
  parking: string;
  moveInDate: string;
  images: string[];
  description: string;
  features: string[];
  agent: AgentContact;
  createdAt: string;
  views: number;
  likes: number;
  distanceKm?: number; // Calculated dynamically from user coordinates
}

export interface UserLocation {
  name: string;
  lat: number;
  lng: number;
  isRealGps: boolean;
}

export interface FilterOptions {
  category: PropertyCategory;
  transactionType: TransactionType;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  sortBy: 'distance' | 'popular' | 'latest' | 'priceAsc' | 'priceDesc';
}
