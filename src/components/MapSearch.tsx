import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Property, PropertyCategory, TransactionType, UserLocation } from '../types';
import { Crosshair, Heart, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface MapSearchProps {
  properties: Property[];
  userLocation: UserLocation;
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  onSelectProperty: (property: Property) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onBackToHome?: () => void;
}

export const MapSearch: React.FC<MapSearchProps> = ({
  properties,
  userLocation,
  selectedCategory,
  onSelectCategory,
  onSelectProperty,
  favorites,
  onToggleFavorite,
  onBackToHome,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [transactionFilter, setTransactionFilter] = useState<TransactionType>('전체');

  // Filter properties
  const filteredProperties = properties.filter((item) => {
    const matchCategory =
      selectedCategory === '전체' || item.category === selectedCategory;
    const matchTx =
      transactionFilter === '전체' || item.transactionType === transactionFilter;
    return matchCategory && matchTx;
  });

  const activeProperty = properties.find((p) => p.id === selectedPropertyId);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: false,
      });

      // OpenStreetMap 무료 표준 지도 타일 (API 키 불필요, 항상 안정적으로 로드됨)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // do not destroy map immediately on minor re-renders, but cleanup if unmounting
    };
  }, []);

  // Update User Location Marker & Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    if (userCircleRef.current) {
      userCircleRef.current.remove();
    }

    // User location blue pulse icon
    const userIcon = L.divIcon({
      className: 'custom-user-pin-wrapper',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
          <div style="position: absolute; width: 24px; height: 24px; border-radius: 9999px; background-color: rgba(37, 99, 235, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; border-radius: 9999px; background-color: #2563eb; border: 2.5px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 100,
    })
      .addTo(map)
      .bindTooltip('내 위치', { permanent: false, direction: 'top', offset: [0, -10] });

    // 1.5km search radius circle
    userCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
      radius: 1200,
      color: '#3b82f6',
      fillColor: '#93c5fd',
      fillOpacity: 0.08,
      weight: 1,
      dashArray: '4, 4',
    }).addTo(map);
  }, [userLocation]);

  // Update Property Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing property markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    filteredProperties.forEach((item) => {
      const isSelected = item.id === selectedPropertyId;

      const markerHtml = `
        <div class="custom-price-pin ${isSelected ? 'active' : ''}">
          <span style="display:inline-block; width:6px; height:6px; border-radius:9999px; background-color:${
            item.transactionType === '월세'
              ? '#f97316'
              : item.transactionType === '전세'
              ? '#0284c7'
              : '#16a34a'
          };"></span>
          <span>${item.shortPrice}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-price-marker',
        html: markerHtml,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const marker = L.marker([item.lat, item.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : 10,
      })
        .addTo(map)
        .on('click', () => {
          setSelectedPropertyId(item.id);
          map.panTo([item.lat, item.lng], { animate: true, duration: 0.4 });
        });

      markersRef.current[item.id] = marker;
    });

    // Auto select first property if none selected or if previously selected is filtered out
    if (filteredProperties.length > 0) {
      if (!selectedPropertyId || !filteredProperties.some((p) => p.id === selectedPropertyId)) {
        setSelectedPropertyId(filteredProperties[0].id);
      }
    } else {
      setSelectedPropertyId(null);
    }
  }, [filteredProperties, selectedPropertyId]);

  // Handle fly to user location
  const handleFlyToUser = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, {
      duration: 0.8,
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-56px-70px)] bg-neutral-100 overflow-hidden flex flex-col">
      {/* Top Floating Filter Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] space-y-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto overflow-x-auto no-scrollbar py-1">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="min-h-[38px] px-3 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold rounded-full shadow-md flex items-center gap-1 shrink-0 border border-neutral-200/80 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>목록</span>
            </button>
          )}

          {/* Transaction Type Filters */}
          <div className="flex items-center p-0.5 bg-white/95 backdrop-blur-md rounded-full shadow-md border border-neutral-200/80 shrink-0">
            {(['전체', '월세', '전세', '매매'] as TransactionType[]).map((tx) => (
              <button
                key={tx}
                onClick={() => setTransactionFilter(tx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  transactionFilter === tx
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tx}
              </button>
            ))}
          </div>

          {/* Category Quick Pills */}
          <div className="flex items-center gap-1 shrink-0">
            {(['전체', '아파트', '빌라', '주택/단독', '원룸', '오피스텔', '건물'] as PropertyCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full shadow-md backdrop-blur-md border transition-all ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white/95 text-neutral-700 border-neutral-200/80 hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Action: GPS Center Button & Count */}
      <div className="absolute right-3 bottom-32 sm:bottom-28 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleFlyToUser}
          className="w-10 h-10 bg-white hover:bg-neutral-50 rounded-full shadow-lg border border-neutral-200/80 flex items-center justify-center text-neutral-700 active:scale-90 transition-transform"
          title="내 위치로 지도 이동"
        >
          <Crosshair className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Bottom Floating Property Card Sheet */}
      {activeProperty ? (
        <div className="absolute bottom-2 left-2 right-2 sm:left-4 sm:right-4 z-[1000] max-w-lg mx-auto">
          <div
            onClick={() => onSelectProperty(activeProperty)}
            className="bg-white rounded-2xl p-3 shadow-xl border border-neutral-200/80 flex gap-3 cursor-pointer hover:border-neutral-400 transition-all active:scale-[0.99]"
          >
            {/* Image Thumbnail */}
            <div className="relative w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
              <img
                src={activeProperty.images[0]}
                alt={activeProperty.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs">
                {activeProperty.category}
              </span>
            </div>

            {/* Content Preview */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <div className="text-sm font-bold text-neutral-900 truncate">
                    {activeProperty.priceLabel}
                  </div>
                  <button
                    onClick={(e) => onToggleFavorite(activeProperty.id, e)}
                    className="p-1 -m-1 text-neutral-400 hover:text-rose-500 shrink-0"
                    title="찜하기"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(activeProperty.id)
                          ? 'text-rose-500 fill-rose-500'
                          : ''
                      }`}
                    />
                  </button>
                </div>
                <h4 className="text-xs font-semibold text-neutral-800 line-clamp-1 mt-0.5 flex items-baseline gap-1">
                  <span className="font-bold text-blue-700 bg-blue-50 px-1 py-0.2 rounded text-[10px] shrink-0 border border-blue-200/50">
                    [{activeProperty.district || activeProperty.region.split(' ')[0]}]
                  </span>
                  <span className="truncate">{activeProperty.title.replace(/^\[.*?\]\s*/, '')}</span>
                </h4>
                <div className="text-[11px] text-neutral-500 truncate mt-1 flex items-center gap-1.5">
                  <span>{activeProperty.region}</span>
                  {activeProperty.distanceKm !== undefined && (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-blue-600">
                        {formatDistance(activeProperty.distanceKm)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
                <span>
                  {activeProperty.areaPyeong}평 ({activeProperty.areaM2}㎡) · {activeProperty.floor}
                </span>
                <span className="text-xs font-semibold text-neutral-900 flex items-center gap-0.5">
                  상세보기 <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-3 left-4 right-4 z-[1000] max-w-sm mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md text-center text-xs text-neutral-500 border border-neutral-200">
            해당 조건의 매물이 지도 영역에 없습니다. 필터를 변경해 보세요.
          </div>
        </div>
      )}
    </div>
  );
};
