export type PropertyCategory = '전체' | '아파트' | '빌라' | '주택/단독' | '원룸' | '오피스텔' | '건물';

export type SpecificCategory = '아파트' | '빌라' | '주택/단독' | '원룸' | '오피스텔' | '건물';

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
  deposit: number | string; // e.g. "2개월(7000만동)" or number
  monthlyRent?: number | string;
  priceLabel: string; // e.g. "월 3,500만동"
  shortPrice: string; // e.g. "3,500만동"
  address: string;
  detailedAddress?: string;
  region: string;
  lat: number;
  lng: number;
  areaPyeong?: number;
  areaM2: number;
  floor: string;
  roomCount: string;
  direction?: string;
  maintenanceFee?: number | string;
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
