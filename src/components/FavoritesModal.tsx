import React from 'react';
import { Property } from '../types';
import { X, Heart, Trash2, ArrowRight, MapPin } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onRemoveFavorite: (id: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  properties,
  onSelectProperty,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                관심 매물 즐겨찾기
              </h2>
              <p className="text-xs text-neutral-500">
                총 {favoriteProperties.length}개의 찜한 매물
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {favoriteProperties.length > 0 ? (
            favoriteProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => {
                  onSelectProperty(prop);
                  onClose();
                }}
                className="p-3 bg-neutral-50/80 hover:bg-neutral-100 rounded-2xl border border-neutral-200/80 flex gap-3 cursor-pointer transition-all active:scale-[0.99] group"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-200">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-black/60">
                    {prop.category}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-bold text-neutral-900 truncate">
                        {prop.priceLabel}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(prop.id);
                        }}
                        className="p-1 text-neutral-400 hover:text-rose-500 rounded"
                        title="찜 해제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-semibold text-neutral-800 line-clamp-1 mt-0.5 group-hover:text-blue-600 transition-colors">
                      {prop.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
                    <span className="truncate">{prop.region}</span>
                    {prop.distanceKm !== undefined && (
                      <span className="font-semibold text-blue-600 shrink-0">
                        {formatDistance(prop.distanceKm)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-neutral-700">
                아직 찜한 매물이 없습니다.
              </h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                매물 카드의 하트(♡) 아이콘을 눌러 관심 있는 매물을 간편하게 모아보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
