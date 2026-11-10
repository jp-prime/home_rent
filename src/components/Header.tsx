import React, { useState } from 'react';
import { Heart, MapPin, Plus, Crosshair, ChevronDown, Check } from 'lucide-react';
import { UserLocation } from '../types';
import { PRESET_LOCATIONS } from '../data/initialProperties';

interface HeaderProps {
  userLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
  onRequestGps: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenRegister: () => void;
  isGpsLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userLocation,
  onSelectLocation,
  onRequestGps,
  favoritesCount,
  onOpenFavorites,
  onOpenRegister,
  isGpsLoading,
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Brand Wordmark & Location Trigger */}
          <div className="flex items-center gap-2.5 min-w-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 shrink-0 group"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm group-hover:bg-neutral-800 transition-colors">
                초
              </div>
              <span className="font-bold text-lg tracking-tight text-neutral-900">
                초이스홈
              </span>
            </a>

            {/* Location Selector Button */}
            <button
              onClick={() => setShowLocationMenu(true)}
              className="flex items-center gap-1 text-xs text-neutral-600 bg-neutral-100 hover:bg-neutral-200/80 px-2.5 py-1.5 rounded-full transition-colors truncate max-w-[170px] sm:max-w-xs"
              title="위치 변경"
            >
              <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="truncate font-medium">
                {userLocation.name.replace(' (기본 위치)', '')}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
            </button>
          </div>

          {/* Right Action Zone: Quick Register + Favorites Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Register Button */}
            <button
              onClick={onOpenRegister}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>매물등록</span>
            </button>

            {/* Favorites Icon (우측 상단 배치) */}
            <button
              onClick={onOpenFavorites}
              aria-label={`즐겨찾기 ${favoritesCount}개`}
              className="relative min-w-[42px] min-h-[42px] flex items-center justify-center rounded-full hover:bg-neutral-100 active:scale-95 transition-all text-neutral-700"
              title="즐겨찾기 목록"
            >
              <Heart
                className={`w-5 h-5 transition-transform ${
                  favoritesCount > 0 ? 'text-rose-500 fill-rose-500 scale-105' : 'text-neutral-700'
                }`}
              />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center shadow-sm">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Location Selection Drawer / Modal */}
      {showLocationMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle for mobile */}
            <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">내 탐색 위치 설정</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  선택한 위치를 기준으로 가까운 추천 매물을 정렬합니다.
                </p>
              </div>
              <button
                onClick={() => setShowLocationMenu(false)}
                className="text-xs text-neutral-400 hover:text-neutral-700 px-2 py-1 rounded"
              >
                닫기
              </button>
            </div>

            {/* GPS Trigger Button */}
            <button
              onClick={() => {
                onRequestGps();
                setShowLocationMenu(false);
              }}
              disabled={isGpsLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-sm active:scale-[0.99] transition-all"
            >
              <Crosshair className={`w-4 h-4 ${isGpsLoading ? 'animate-spin' : ''}`} />
              <span>{isGpsLoading ? '현재 GPS 위치 수신 중...' : '현재 내 GPS 위치로 찾기'}</span>
            </button>

            {/* Preset Locations List */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-100">
              <span className="text-[11px] font-medium text-neutral-400 px-1">주요 인기 지역 바로가기</span>
              <div className="space-y-1">
                {PRESET_LOCATIONS.map((loc) => {
                  const isSelected = userLocation.name === loc.name;
                  return (
                    <button
                      key={loc.name}
                      onClick={() => {
                        onSelectLocation(loc);
                        setShowLocationMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-neutral-100 text-neutral-900 font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-50 font-normal'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`} />
                        <span>{loc.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-neutral-900" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
