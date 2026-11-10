/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Property,
  PropertyCategory,
  UserLocation,
} from './types';
import { INITIAL_PROPERTIES, DEFAULT_USER_LOCATION } from './data/initialProperties';
import { calculateDistanceKm } from './utils/geo';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { MapSearch } from './components/MapSearch';
import { PropertyDetail } from './components/PropertyDetail';
import { PropertyRegisterModal } from './components/PropertyRegisterModal';
import { FavoritesModal } from './components/FavoritesModal';

export default function App() {
  // Properties state initialized with local storage or initial Ho Chi Minh sample data
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('choicehome_hcm_properties_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title.includes('호치민')) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved properties', e);
      }
    }
    return INITIAL_PROPERTIES;
  });

  // User current location for recommendations and distance calculation (defaults to Ho Chi Minh City)
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    const saved = localStorage.getItem('choicehome_hcm_user_location_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name.includes('호치민')) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    }
    return DEFAULT_USER_LOCATION;
  });

  // Favorites bookmarked IDs
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('choicehome_hcm_favorites_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    return ['prop-1', 'prop-2'];
  });

  // Navigation states
  const [currentTab, setCurrentTab] = useState<'home' | 'map' | 'favorites'>('home');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('전체');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('choicehome_hcm_properties_v3', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('choicehome_hcm_favorites_v3', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('choicehome_hcm_user_location_v3', JSON.stringify(userLocation));
  }, [userLocation]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Compute distance from current userLocation to each property
  const propertiesWithDistance = useMemo(() => {
    return properties.map((prop) => {
      const distance = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        prop.lat,
        prop.lng
      );
      return {
        ...prop,
        distanceKm: distance,
      };
    });
  }, [properties, userLocation]);

  // Favorite toggle handler
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('관심 매물에서 제외되었습니다.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('관심 매물에 추가되었습니다.');
        return [...prev, id];
      }
    });
  };

  // Handle GPS location request
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      showToast('브라우저에서 위치 서비스를 지원하지 않습니다.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        const newLoc: UserLocation = {
          name: '현재 내 GPS 위치 (실시간)',
          lat: latitude,
          lng: longitude,
          isRealGps: true,
        };
        setUserLocation(newLoc);
        showToast('현재 위치를 기반으로 매물을 새로 정렬했습니다.');
      },
      (err) => {
        setIsGpsLoading(false);
        console.warn('Geolocation error:', err);
        showToast('GPS 위치 권한을 허용해주세요. (기본 강남구 위치로 유지됩니다)');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Handle Register New Property
  const handleRegisterProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    showToast(`'${newProp.title}' 매물이 성공적으로 등록되었습니다.`);
    // Select the new property to show right away
    setSelectedProperty(newProp);
  };

  // Current active property with updated distance
  const currentActiveProperty = useMemo(() => {
    if (!selectedProperty) return null;
    return (
      propertiesWithDistance.find((p) => p.id === selectedProperty.id) ||
      selectedProperty
    );
  }, [selectedProperty, propertiesWithDistance]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Header (shown when not viewing a detail page) */}
      {!currentActiveProperty && (
        <Header
          userLocation={userLocation}
          onSelectLocation={(loc) => {
            setUserLocation(loc);
            showToast(`${loc.name} 기준으로 매물을 탐색합니다.`);
          }}
          onRequestGps={handleRequestGps}
          favoritesCount={favorites.length}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
          isGpsLoading={isGpsLoading}
        />
      )}

      {/* Main Body Routing */}
      <main className="flex-1 w-full">
        {currentActiveProperty ? (
          // Detail View
          <PropertyDetail
            property={currentActiveProperty}
            allProperties={propertiesWithDistance}
            onBack={() => setSelectedProperty(null)}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            isFavorite={favorites.includes(currentActiveProperty.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : currentTab === 'map' ? (
          // Map Search View
          <MapSearch
            properties={propertiesWithDistance}
            userLocation={userLocation}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onBackToHome={() => setCurrentTab('home')}
          />
        ) : currentTab === 'favorites' ? (
          // Favorites Direct Tab View
          <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-neutral-900">
                관심 매물 목록
              </h1>
              <span className="text-xs text-neutral-500">
                {favorites.length}개 보관 중
              </span>
            </div>

            {favorites.length > 0 ? (
              <div className="space-y-3">
                {propertiesWithDistance
                  .filter((p) => favorites.includes(p.id))
                  .map((prop) => (
                    <div
                      key={prop.id}
                      onClick={() => setSelectedProperty(prop)}
                      className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-xs flex gap-3.5 cursor-pointer hover:border-neutral-400 transition-all active:scale-[0.99]"
                    >
                      <div className="relative w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-black/60">
                          {prop.category}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="text-base font-bold text-neutral-900">
                            {prop.priceLabel}
                          </div>
                          <h3 className="text-xs font-semibold text-neutral-800 line-clamp-1 mt-0.5">
                            {prop.title}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
                          <span className="truncate">{prop.region}</span>
                          <span className="text-blue-600 font-medium">상세보기</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200/80 space-y-3">
                <p className="text-sm font-bold text-neutral-700">
                  아직 찜한 관심 매물이 없습니다.
                </p>
                <p className="text-xs text-neutral-400">
                  매물 카드의 하트 버튼을 눌러 관심 있는 부동산을 저장해 보세요.
                </p>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl"
                >
                  홈에서 매물 둘러보기
                </button>
              </div>
            )}
          </div>
        ) : (
          // Home View
          <HomeView
            properties={propertiesWithDistance}
            userLocation={userLocation}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenMap={() => setCurrentTab('map')}
            onRequestGps={handleRequestGps}
          />
        )}
      </main>

      {/* Bottom Sticky Category & Navigation Bar (hidden on detail view) */}
      {!currentActiveProperty && (
        <BottomNav
          currentTab={currentTab}
          onChangeTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (currentTab !== 'home' && currentTab !== 'map') {
              setCurrentTab('home');
            }
          }}
          onOpenRegister={() => setIsRegisterOpen(true)}
          favoritesCount={favorites.length}
        />
      )}

      {/* Property Registration Modal */}
      <PropertyRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegisterProperty}
        userLocation={userLocation}
      />

      {/* Top-Right Favorites Drawer */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        properties={propertiesWithDistance}
        onSelectProperty={(prop) => {
          setSelectedProperty(prop);
          setIsFavoritesOpen(false);
        }}
        onRemoveFavorite={handleToggleFavorite}
      />
    </div>
  );
}
