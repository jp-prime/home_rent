import React, { useState } from 'react';
import {
  Property,
  PropertyCategory,
  TransactionType,
  UserLocation,
} from '../types';
import {
  Search,
  MapPin,
  Heart,
  Map,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface HomeViewProps {
  properties: Property[];
  userLocation: UserLocation;
  selectedCategory: PropertyCategory;
  onSelectCategory: (cat: PropertyCategory) => void;
  onSelectProperty: (property: Property) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onOpenMap: () => void;
  onRequestGps: () => void;
}

const DISTRICT_TABS = ['전체', '1군', '2군 (타오디엔)', '7군 (푸미흥)', '빈탄군', '3/4군'];

export const HomeView: React.FC<HomeViewProps> = ({
  properties,
  userLocation,
  selectedCategory,
  onSelectCategory,
  onSelectProperty,
  favorites,
  onToggleFavorite,
  onOpenMap,
  onRequestGps,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<TransactionType>('전체');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<'distance' | 'latest' | 'popular'>('distance');

  // Filter properties based on search query, category, transaction type, district
  const filteredProperties = properties.filter((item) => {
    const matchCategory =
      selectedCategory === '전체' || item.category === selectedCategory;
    const matchTx =
      selectedTx === '전체' || item.transactionType === selectedTx;

    // District filter
    let matchDistrict = true;
    if (selectedDistrict !== '전체') {
      const target = selectedDistrict.split(' ')[0]; // '1군', '2군', '7군', '빈탄군', '3/4군'
      if (target === '3/4군') {
        matchDistrict =
          item.title.includes('3군') ||
          item.title.includes('4군') ||
          item.district?.includes('3군') ||
          item.district?.includes('4군') ||
          item.region.includes('3군') ||
          item.region.includes('4군');
      } else {
        matchDistrict =
          item.title.includes(target) ||
          item.district?.includes(target) ||
          item.region.includes(target);
      }
    }

    const query = searchQuery.trim().toLowerCase();
    const matchQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query) ||
      item.region.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.district && item.district.toLowerCase().includes(query)) ||
      item.features.some((f) => f.toLowerCase().includes(query));

    return matchCategory && matchTx && matchDistrict && matchQuery;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'distance') {
      return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
    }
    if (sortBy === 'popular') {
      return b.views + b.likes * 2 - (a.views + a.likes * 2);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Nearby recommended items (top 4 closest to Ho Chi Minh user location)
  const nearbyProperties = [...properties]
    .sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
    .slice(0, 4);

  // Category items with count
  const CATEGORY_ITEMS: { key: PropertyCategory; name: string; count: number }[] = [
    { key: '전체', name: '전체보기', count: properties.length },
    { key: '아파트', name: '아파트', count: properties.filter((p) => p.category === '아파트').length },
    { key: '빌라', name: '빌라·단독', count: properties.filter((p) => p.category === '빌라').length },
    { key: '원룸', name: '원룸·스튜디오', count: properties.filter((p) => p.category === '원룸').length },
    { key: '오피스텔', name: '오피스텔', count: properties.filter((p) => p.category === '오피스텔').length },
    { key: '건물', name: '건물·상가', count: properties.filter((p) => p.category === '건물').length },
  ];

  // Helper to render title with [위치] prominently in the front as requested
  const renderLocationTitle = (prop: Property, isLarge = false) => {
    // Check if title has [위치]
    const match = prop.title.match(/^\[(.*?)\]\s*(.*)$/);
    const locationTag = match ? match[1] : (prop.district || prop.region.split(' ')[0] || '호치민');
    const titleText = match ? match[2] : prop.title;

    return (
      <h3
        className={`${
          isLarge ? 'text-sm' : 'text-xs'
        } font-semibold text-neutral-800 line-clamp-1 mt-1 group-hover:text-blue-600 transition-colors flex items-baseline gap-1`}
      >
        <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] shrink-0 border border-blue-200/60">
          [{locationTag}]
        </span>
        <span className="truncate">{titleText}</span>
      </h3>
    );
  };

  return (
    <div className="pb-28">
      {/* Search Header Banner */}
      <section className="bg-white border-b border-neutral-200/80 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="호치민 1군, 7군 푸미흥, 빈홈, 타오디엔 검색"
              className="w-full pl-10 pr-10 py-3 bg-neutral-100 hover:bg-neutral-100/90 focus:bg-white text-sm text-neutral-900 rounded-2xl border border-transparent focus:border-neutral-900 focus:outline-none transition-all placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 bg-neutral-200 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>

          {/* Quick District Selector (호치민 1군, 2군, 7군, 빈탄군 등) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
            <span className="text-[11px] font-bold text-neutral-400 mr-1 shrink-0">지역:</span>
            {DISTRICT_TABS.map((dist) => {
              const isActive = selectedDistrict === dist;
              return (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {dist}
                </button>
              );
            })}
          </div>

          {/* Quick Transaction Segmented Control & Map Button */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl overflow-x-auto no-scrollbar">
              {(['전체', '월세', '매매'] as TransactionType[]).map((tx) => (
                <button
                  key={tx}
                  onClick={() => setSelectedTx(tx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    selectedTx === tx
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {tx}
                </button>
              ))}
            </div>

            {/* Map Direct Button */}
            <button
              onClick={onOpenMap}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 active:scale-95 transition-all"
            >
              <Map className="w-3.5 h-3.5" />
              <span>호치민 지도</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid (Mobile Friendly) */}
      <section className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-neutral-800">매물 유형별 탐색</span>
            <span className="text-[11px] text-neutral-400">호치민 총 {properties.length}건 등록</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CATEGORY_ITEMS.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => onSelectCategory(cat.key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-neutral-50/80 text-neutral-800 border-neutral-200/60 hover:bg-neutral-100'
                  }`}
                >
                  <span className="text-xs font-bold">{cat.name}</span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-400'
                    }`}
                  >
                    {cat.count}개
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Requirement: 사용자 위치 기반 추천 매물 (User Location-based Recommendations in Ho Chi Minh) */}
      <section className="px-4 py-5 bg-gradient-to-b from-blue-50/40 via-white to-white border-b border-neutral-200/60">
        <div className="max-w-2xl mx-auto space-y-3.5">
          {/* Section Header with Location & GPS status */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold mb-1">
                <Navigation className="w-3.5 h-3.5" />
                <span>내 위치 기반 추천 매물</span>
              </div>
              <h2 className="text-base font-bold text-neutral-900">
                {userLocation.name.replace(' (기본 위치)', '')} 주변 매물
              </h2>
            </div>
            <button
              onClick={onRequestGps}
              className="text-[11px] font-medium text-neutral-600 bg-white hover:bg-neutral-50 border border-neutral-200/90 px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1 shrink-0"
              title="GPS 갱신"
            >
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>위치 갱신</span>
            </button>
          </div>

          {/* Horizontal Scrollable Nearby Cards */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 pb-1">
            {nearbyProperties.map((prop) => {
              const isFav = favorites.includes(prop.id);
              return (
                <div
                  key={`nearby-${prop.id}`}
                  onClick={() => onSelectProperty(prop)}
                  className="w-68 shrink-0 bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-36 bg-neutral-100 overflow-hidden">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {/* Distance Pill */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-blue-600/90 backdrop-blur-xs flex items-center gap-1 shadow-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{formatDistance(prop.distanceKm)}</span>
                    </div>

                    {/* Category Label */}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs">
                      {prop.category} · {prop.transactionType}
                    </span>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => onToggleFavorite(prop.id, e)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      title="찜하기"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'text-rose-500 fill-rose-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Info: [위치] at the front */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-base font-bold text-neutral-900 tracking-tight">
                        {prop.priceLabel}
                      </div>
                      {renderLocationTitle(prop, false)}
                    </div>

                    <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>
                        {prop.areaPyeong}평 ({prop.areaM2}㎡) · {prop.floor}
                      </span>
                      <span className="text-blue-600 font-medium">
                        {prop.agent.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Listings Feed */}
      <section className="px-4 py-5 max-w-2xl mx-auto space-y-3">
        {/* Sort and Count Bar */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-neutral-900">
              {selectedCategory === '전체' ? '호치민 매물' : `${selectedCategory} 매물`}
            </span>
            <span className="text-xs text-neutral-500 ml-1.5">
              ({sortedProperties.length}개)
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setSortBy('distance')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === 'distance'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-800 bg-neutral-100'
              }`}
            >
              거리순
            </button>
            <button
              onClick={() => setSortBy('latest')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === 'latest'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-800 bg-neutral-100'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === 'popular'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-800 bg-neutral-100'
              }`}
            >
              인기순
            </button>
          </div>
        </div>

        {/* Listings List (Vertical Cards) - [위치] 나오게 맨앞자리 배치 */}
        {sortedProperties.length > 0 ? (
          <div className="space-y-3">
            {sortedProperties.map((prop) => {
              const isFav = favorites.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-xs flex flex-col sm:flex-row gap-3.5 cursor-pointer hover:border-neutral-400 hover:shadow-sm transition-all active:scale-[0.99] group"
                >
                  {/* Photo Thumbnail */}
                  <div className="relative w-full sm:w-44 h-48 sm:h-36 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs">
                        {prop.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-blue-600">
                        {prop.transactionType}
                      </span>
                    </div>

                    <button
                      onClick={(e) => onToggleFavorite(prop.id, e)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      title="관심 매물 등록"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'text-rose-500 fill-rose-500' : 'text-white'
                        }`}
                      />
                    </button>

                    {prop.distanceKm !== undefined && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-neutral-900/80 backdrop-blur-xs flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-blue-400" />
                        <span>{formatDistance(prop.distanceKm)}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content with [위치] at the very front */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      {/* Price Title */}
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-lg font-bold text-neutral-900 tracking-tight">
                          {prop.priceLabel}
                        </span>
                        {prop.maintenanceFee > 0 && (
                          <span className="text-xs text-neutral-500">
                            관리비 ${prop.maintenanceFee}
                          </span>
                        )}
                      </div>

                      {/* Explicit Requirement: 리스트에 맨앞자리에 [위치] 나오게 */}
                      {renderLocationTitle(prop, true)}

                      {/* Clean Unboxed Metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1.5 flex-wrap">
                        <span>{prop.areaPyeong}평 ({prop.areaM2}㎡)</span>
                        <span aria-hidden="true">·</span>
                        <span>{prop.floor}</span>
                        <span aria-hidden="true">·</span>
                        <span>{prop.roomCount}</span>
                        {prop.direction && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{prop.direction}</span>
                          </>
                        )}
                      </div>

                      {/* Address */}
                      <p className="text-xs text-neutral-400 truncate mt-1">
                        {prop.address}
                      </p>
                    </div>

                    {/* Footer Row: Agent contact & Zalo/Kakao quick badge */}
                    <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-medium truncate max-w-[140px]">
                          {prop.agent.agencyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <span>Zalo: {prop.agent.zaloPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-center space-y-2">
            <p className="text-sm font-bold text-neutral-700">
              해당 조건의 호치민 매물이 없습니다.
            </p>
            <p className="text-xs text-neutral-400">
              검색어나 지역 필터를 변경해 보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTx('전체');
                setSelectedDistrict('전체');
                onSelectCategory('전체');
              }}
              className="mt-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl"
            >
              필터 초기화
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
