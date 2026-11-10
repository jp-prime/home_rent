import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { Property } from '../types';

// Sanity 프로젝트 ID와 데이터셋 설정
// Vercel 환경 변수나 .env 파일의 VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET 값을 읽어옵니다.
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = '2024-03-01';

export const isSanityConfigured = Boolean(projectId && projectId.trim() !== '');

export const sanityClient = createClient({
  projectId: projectId || 'demo-placeholder',
  dataset,
  apiVersion,
  useCdn: true, // 빠른 조회를 위해 CDN 캐시 사용
});

const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: any) {
  if (!source) return '';
  if (typeof source === 'string') return source;
  try {
    return imageBuilder.image(source).auto('format').fit('max').url();
  } catch (e) {
    return '';
  }
}

// GROQ 쿼리: 등록된 모든 매물 불러오기 (최신순)
export const PROPERTIES_QUERY = `*[_type == "property"] | order(_createdAt desc) {
  _id,
  _createdAt,
  title,
  category,
  transactionType,
  district,
  deposit,
  monthlyRent,
  priceLabel,
  shortPrice,
  address,
  detailedAddress,
  region,
  lat,
  lng,
  areaPyeong,
  areaM2,
  floor,
  roomCount,
  direction,
  maintenanceFee,
  maintenanceFeeIncludes,
  parking,
  moveInDate,
  images,
  description,
  features,
  agent,
  views,
  likes
}`;

// Sanity에서 가져온 원시 데이터를 프론트엔드의 Property 형식으로 변환
export function transformSanityProperty(item: any): Property {
  // 이미지 배열 변환 (Sanity 이미지 에셋 -> 웹 URL)
  const formattedImages: string[] = Array.isArray(item.images)
    ? item.images.map((img: any) => urlForImage(img)).filter(Boolean)
    : [];

  return {
    id: item._id,
    category: item.category || '아파트',
    transactionType: item.transactionType || '월세',
    district: item.district || '',
    title: item.title || '무제 매물',
    deposit: item.deposit ? String(item.deposit) : '',
    monthlyRent: item.monthlyRent ? String(item.monthlyRent) : undefined,
    priceLabel: item.priceLabel || '',
    shortPrice: item.shortPrice || item.priceLabel || '',
    address: item.address || '',
    detailedAddress: item.detailedAddress || '',
    region: item.region || '',
    lat: Number(item.lat) || 10.7769, // 기본 호치민 좌표
    lng: Number(item.lng) || 106.7009,
    areaPyeong: item.areaPyeong ? Number(item.areaPyeong) : (item.areaM2 ? Math.round(Number(item.areaM2) / 3.3) : 0),
    areaM2: Number(item.areaM2) || 0,
    floor: item.floor || '',
    roomCount: item.roomCount || '',
    direction: item.direction || '',
    maintenanceFee: item.maintenanceFee ? String(item.maintenanceFee) : 0,
    maintenanceFeeIncludes: Array.isArray(item.maintenanceFeeIncludes) ? item.maintenanceFeeIncludes : [],
    parking: item.parking || '가능',
    moveInDate: item.moveInDate || '즉시 입주',
    images: formattedImages.length > 0 ? formattedImages : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
    description: item.description || '',
    features: Array.isArray(item.features) ? item.features : [],
    agent: item.agent ? {
      name: item.agent.name || '담당자',
      agencyName: item.agent.agencyName || '부동산 중개',
      kakaoId: item.agent.kakaoId || '',
      zaloPhone: item.agent.zaloPhone || '',
      phone: item.agent.phone || '',
      verified: Boolean(item.agent.verified),
      avatar: item.agent.avatar ? urlForImage(item.agent.avatar) : undefined,
    } : {
      name: '공인중개사',
      agencyName: '호치민 홈즈',
      kakaoId: '',
      zaloPhone: '',
      phone: '',
      verified: true
    },
    createdAt: item._createdAt || new Date().toISOString(),
    views: Number(item.views) || 0,
    likes: Number(item.likes) || 0,
  };
}

export async function fetchSanityProperties(): Promise<Property[]> {
  if (!isSanityConfigured) {
    return [];
  }
  const rawData = await sanityClient.fetch(PROPERTIES_QUERY);
  if (!Array.isArray(rawData)) return [];
  return rawData.map(transformSanityProperty);
}
