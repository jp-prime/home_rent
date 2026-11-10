import React, { useState } from 'react';
import { Property } from '../types';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  CheckCircle2,
  Phone,
  Copy,
  Check,
  Building,
  Calendar,
  Compass,
  Car,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { formatDistance, formatKoreanPrice } from '../utils/geo';

interface PropertyDetailProps {
  property: Property;
  allProperties: Property[];
  onBack: () => void;
  onSelectProperty: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  allProperties,
  onBack,
  onSelectProperty,
  isFavorite,
  onToggleFavorite,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedType, setCopiedType] = useState<'kakao' | 'zalo' | 'address' | null>(null);

  // Other recommendations (excluding current property):
  // Filter similar category or nearby, with exactly (위치 + 제목 + 가격) thumbnails
  const recommendations = allProperties
    .filter((p) => p.id !== property.id)
    .sort((a, b) => {
      // Prioritize same category, then distance
      if (a.category === property.category && b.category !== property.category) return -1;
      if (b.category === property.category && a.category !== property.category) return 1;
      return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
    })
    .slice(0, 5);

  const handleCopy = (text: string, type: 'kakao' | 'zalo' | 'address') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-32">
      {/* Sticky Top Nav for Detail */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 h-14 flex items-center justify-between">
        <button
          onClick={onBack}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center -ml-2 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
          title="뒤로 가기"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-neutral-900 truncate max-w-[200px] sm:max-w-xs">
          {property.title}
        </h1>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(property.id)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            title="즐겨찾기 토글"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'text-rose-500 fill-rose-500' : 'text-neutral-700'
              }`}
            />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* Photo Carousel */}
        <div className="relative aspect-4/3 bg-neutral-900 overflow-hidden">
          <img
            src={property.images[activePhotoIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Photo Counter Pill */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
              {activePhotoIndex + 1} / {property.images.length}
            </div>
          )}

          {/* Photo Navigation Indicators */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activePhotoIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-black/60 backdrop-blur-xs">
              {property.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 shadow-xs">
              {property.transactionType}
            </span>
          </div>
        </div>

        {/* Main Price & Title Card */}
        <div className="bg-white p-5 border-b border-neutral-200/80 space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                {property.priceLabel}
              </span>
              {property.transactionType === '월세' && property.deposit && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  보증금 {formatKoreanPrice(property.deposit)}
                </p>
              )}
            </div>
            {property.distanceKm !== undefined && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                내 위치에서 {formatDistance(property.distanceKm)}
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-neutral-900 leading-snug">
            {property.title}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{property.address}</span>
            <button
              onClick={() => handleCopy(property.address, 'address')}
              className="text-[11px] text-neutral-700 underline font-medium ml-1 shrink-0"
            >
              {copiedType === 'address' ? '복사됨!' : '주소복사'}
            </button>
          </div>
        </div>

        {/* Key Specifications Grid */}
        <div className="bg-white p-5 border-b border-neutral-200/80">
          <h3 className="text-xs font-bold text-neutral-800 mb-3">매물 상세 정보</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-400 block">전용면적</span>
              <span className="text-sm font-bold text-neutral-800 mt-0.5 block">
                {property.areaPyeong}평 ({property.areaM2}㎡)
              </span>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-400 block">해당층 / 전체층</span>
              <span className="text-sm font-bold text-neutral-800 mt-0.5 block">
                {property.floor}
              </span>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-400 block">방 / 욕실</span>
              <span className="text-sm font-bold text-neutral-800 mt-0.5 block">
                {property.roomCount}
              </span>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-400 block">방향</span>
              <span className="text-sm font-bold text-neutral-800 mt-0.5 block">
                {property.direction ?? '남향'}
              </span>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-400 block">주차 여부</span>
              <span className="text-sm font-bold text-neutral-800 mt-0.5 block">
                {property.parking}
              </span>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-400 block">입주 가능일</span>
              <span className="text-sm font-bold text-neutral-800 mt-0.5 block">
                {property.moveInDate}
              </span>
            </div>
          </div>

          {/* Maintenance Fee Details */}
          <div className="mt-3.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-neutral-800">
                월 관리비 {property.maintenanceFee}만원
              </span>
              {property.maintenanceFeeIncludes.length > 0 && (
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  포함 항목: {property.maintenanceFeeIncludes.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        {property.features.length > 0 && (
          <div className="bg-white p-5 border-b border-neutral-200/80">
            <h3 className="text-xs font-bold text-neutral-800 mb-2.5">매물 특징 & 옵션</h3>
            <div className="flex flex-wrap gap-1.5">
              {property.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Description */}
        <div className="bg-white p-5 border-b border-neutral-200/80 space-y-2">
          <h3 className="text-xs font-bold text-neutral-800">상세 설명</h3>
          <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </div>

        {/* Explicit Prompt Requirement: 담당자 : 카카오톡 아이디 또는 zalo전화번호 안내 */}
        <div className="bg-white p-5 border-b border-neutral-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 tracking-tight block">
                담당 공인중개사 직통 안내
              </span>
              <h3 className="text-base font-bold text-neutral-900 mt-0.5">
                {property.agent.name}
              </h3>
            </div>
            {property.agent.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                인증 중개사
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-500">
            {property.agent.agencyName}
          </p>

          {/* Kakao & Zalo Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* KakaoTalk Card */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-800 block uppercase tracking-wide">
                  카카오톡 문의 (Kakao ID)
                </span>
                <span className="text-sm font-bold text-neutral-900 truncate block mt-0.5">
                  {property.agent.kakaoId}
                </span>
              </div>
              <button
                onClick={() => handleCopy(property.agent.kakaoId, 'kakao')}
                className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-neutral-900 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                title="카카오톡 아이디 복사"
              >
                {copiedType === 'kakao' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>복사완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>아이디 복사</span>
                  </>
                )}
              </button>
            </div>

            {/* Zalo / Phone Card */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-blue-800 block uppercase tracking-wide">
                  Zalo 전화번호 (Zalo / Phone)
                </span>
                <span className="text-sm font-bold text-neutral-900 truncate block mt-0.5">
                  {property.agent.zaloPhone}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(property.agent.zaloPhone, 'zalo')}
                  className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-semibold"
                  title="번호 복사"
                >
                  {copiedType === 'zalo' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={`tel:${property.agent.phone}`}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>전화걸기</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Explicit Prompt Requirement: 매물을 볼때 상세정보 아래, 다른 추천 매물 썸네일(위치+제목+가격) 리스트 */}
        <section className="bg-white p-5 border-b border-neutral-200/80 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 block">
                맞춤 연계 탐색
              </span>
              <h3 className="text-sm font-bold text-neutral-900">
                다른 추천 매물 (위치 + 제목 + 가격)
              </h3>
            </div>
            <span className="text-xs text-neutral-400">
              {recommendations.length}개 추천
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => {
                  onSelectProperty(rec);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2.5 rounded-xl border border-neutral-200/80 hover:border-neutral-400 bg-neutral-50/50 flex gap-3 cursor-pointer transition-all active:scale-[0.99] group"
              >
                {/* 썸네일 이미지 */}
                <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                  <img
                    src={rec.images[0]}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-black/60">
                    {rec.category}
                  </span>
                </div>

                {/* 위치 + 제목 + 가격 리스트 */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    {/* 위치 */}
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{rec.region}</span>
                    </div>

                    {/* 제목 (맨앞에 [위치] 표시) */}
                    <h4 className="text-xs font-semibold text-neutral-900 truncate mt-0.5 group-hover:text-blue-600 transition-colors flex items-baseline gap-1">
                      <span className="font-bold text-blue-700 bg-blue-50 px-1 py-0.2 rounded text-[10px] shrink-0 border border-blue-200/50">
                        [{rec.district || rec.region.split(' ')[0]}]
                      </span>
                      <span className="truncate">{rec.title.replace(/^\[.*?\]\s*/, '')}</span>
                    </h4>
                  </div>

                  {/* 가격 */}
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs font-bold text-neutral-900 tracking-tight">
                      {rec.priceLabel}
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium flex items-center">
                      보기 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Contact Bar (Mobile Ergonomics) */}
      <aside aria-label="담당자 문의하기" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {/* KakaoTalk Direct Quick Action */}
          <button
            onClick={() => handleCopy(property.agent.kakaoId, 'kakao')}
            className="flex-1 h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span>{copiedType === 'kakao' ? '✓ 카톡ID 복사됨' : '카카오톡 문의'}</span>
          </button>

          {/* Direct Phone / Zalo Action */}
          <a
            href={`tel:${property.agent.phone}`}
            className="flex-1 h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>전화 / Zalo 연결</span>
          </a>
        </div>
      </aside>
    </div>
  );
};
