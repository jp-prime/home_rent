import React from 'react';
import { Home, Map, PlusCircle, Heart } from 'lucide-react';
import { PropertyCategory } from '../types';

interface BottomNavProps {
  currentTab: 'home' | 'map' | 'favorites';
  onChangeTab: (tab: 'home' | 'map' | 'favorites') => void;
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  onOpenRegister: () => void;
  favoritesCount: number;
}

const CATEGORIES: { label: PropertyCategory; desc: string }[] = [
  { label: '전체', desc: '모든 매물' },
  { label: '아파트', desc: '단지·주상복합' },
  { label: '빌라', desc: '연립·다세대' },
  { label: '원룸', desc: '원룸·투룸' },
  { label: '오피스텔', desc: '주거·업무용' },
  { label: '건물', desc: '상가·빌딩·사옥' },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  selectedCategory,
  onSelectCategory,
  onOpenRegister,
  favoritesCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-lg mx-auto">
        {/* Upper Segment: Horizontally Scrollable Category Bar (넘치면 가로 스크롤) */}
        <div className="border-b border-neutral-100 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => {
                  onSelectCategory(cat.label);
                  if (currentTab === 'favorites') {
                    onChangeTab('home');
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Lower Segment: Core Tab Bar with 44px+ Touch Targets */}
        <div className="grid grid-cols-4 items-center h-14 px-2">
          {/* Home Tab */}
          <button
            onClick={() => onChangeTab('home')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'home' ? 'text-neutral-900 font-semibold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">홈</span>
          </button>

          {/* Map Search Tab */}
          <button
            onClick={() => onChangeTab('map')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'map' ? 'text-neutral-900 font-semibold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Map className={`w-5 h-5 ${currentTab === 'map' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">지도검색</span>
          </button>

          {/* Quick Register Property Tab */}
          <button
            onClick={onOpenRegister}
            className="flex flex-col items-center justify-center h-full min-h-[44px] text-neutral-600 hover:text-neutral-900 active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5 tracking-tight">매물등록</span>
          </button>

          {/* Favorites Tab */}
          <button
            onClick={() => onChangeTab('favorites')}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'favorites' ? 'text-neutral-900 font-semibold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                currentTab === 'favorites' ? 'text-rose-500 fill-rose-500 stroke-[2]' : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] mt-0.5 tracking-tight">관심매물</span>
            {favoritesCount > 0 && (
              <span className="absolute top-1.5 right-6 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
