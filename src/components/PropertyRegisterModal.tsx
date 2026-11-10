import React, { useState } from 'react';
import {
  Property,
  SpecificCategory,
  UserLocation,
} from '../types';
import { X, Check, MapPin, Building2, Phone } from 'lucide-react';
import { PRESET_LOCATIONS, HOCHIMINH_DISTRICTS } from '../data/initialProperties';

interface PropertyRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (property: Property) => void;
  userLocation: UserLocation;
}

const PRESET_SAMPLE_IMAGES: { label: string; url: string }[] = [
  { label: '아파트 거실', url: '/src/assets/images/apt_modern_living_1794323939982.jpg' },
  { label: '오피스텔 시티뷰', url: '/src/assets/images/officetel_minimal_view_1794323939846.jpg' },
  { label: '빌라 테라스', url: '/src/assets/images/villa_cozy_terrace_1794323940168.jpg' },
  { label: '원룸 햇살방', url: '/src/assets/images/oneroom_studio_cozy_1794323940533.jpg' },
  { label: '빌딩 외관', url: '/src/assets/images/building_modern_facade_1794323940240.jpg' },
];

export const PropertyRegisterModal: React.FC<PropertyRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  userLocation,
}) => {
  const [category, setCategory] = useState<SpecificCategory>('아파트');
  const [transactionType, setTransactionType] = useState<'월세' | '전세' | '매매'>('월세');
  
  // Specific District Selection for Ho Chi Minh
  const [district, setDistrict] = useState('호치민 1군');
  const [customDistrict, setCustomDistrict] = useState('');
  const [specificLocation, setSpecificLocation] = useState('빈홈 골든리버 (Vinhomes Golden River)');

  const [title, setTitle] = useState('리버뷰 고층 2룸 풀옵션 아파트');
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');
  const [monthlyRentUsd, setMonthlyRentUsd] = useState<number>(1200); // $1,200
  const [depositUsd, setDepositUsd] = useState<number>(2400); // $2,400

  const [address, setAddress] = useState('02 Tôn Đức Thắng, Bến Nghé, Quận 1, TP. Hồ Chí Minh');
  const [areaPyeong, setAreaPyeong] = useState<number>(24);
  const [floor, setFloor] = useState('15층 / 36층');
  const [roomCount, setRoomCount] = useState('방 2 · 욕실 2');
  const [direction, setDirection] = useState('동남향 (리버뷰)');
  const [maintenanceFeeUsd, setMaintenanceFeeUsd] = useState<number>(15);
  const [parking, setParking] = useState('오토바이 및 차량 주차 가능');
  const [moveInDate, setMoveInDate] = useState('즉시 입주 가능');
  const [selectedImages, setSelectedImages] = useState<string[]>([
    PRESET_SAMPLE_IMAGES[0].url,
  ]);
  const [description, setDescription] = useState(
    '호치민 중심가에 위치한 특급 매물입니다. 풀퍼니처 고급 인테리어 및 24시간 보안, 수영장·헬스장 완비되어 즉시 입주 가능합니다.'
  );

  // Agent Contact (Kakao & Zalo)
  const [agentName, setAgentName] = useState('김초이스 지사장');
  const [agencyName, setAgencyName] = useState('초이스 리얼티 호치민');
  const [kakaoId, setKakaoId] = useState('choice_hcm2026');
  const [zaloPhone, setZaloPhone] = useState('+84903429881');
  const [phone, setPhone] = useState('090-342-9881');

  if (!isOpen) return null;

  const effectiveDistrict = district === '직접 입력' ? (customDistrict || '호치민') : district;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('매물 제목을 입력해주세요.');
      return;
    }

    // Format title with [위치] at the very front as explicitly requested:
    // "리스트에 맨앞자리에 [위치] 나오게 해줘"
    let cleanTitle = title.trim();
    const shortDistrictTag = effectiveDistrict.split(' ')[0] + ' ' + (effectiveDistrict.split(' ')[1] || '').replace(/\(.*\)/, '').trim();
    if (!cleanTitle.startsWith('[')) {
      cleanTitle = `[${shortDistrictTag}] ${cleanTitle}`;
    }

    // Price label
    let priceLabel = '';
    let shortPrice = '';
    if (currency === 'USD') {
      const approxKrw = Math.round((monthlyRentUsd * 1350) / 10000);
      priceLabel = `월세 $${monthlyRentUsd.toLocaleString()} (약 ${approxKrw}만)`;
      shortPrice = `$${monthlyRentUsd.toLocaleString()}/월`;
    } else {
      priceLabel = `월세 ${depositUsd}만 / ${monthlyRentUsd}만원`;
      shortPrice = `${depositUsd}/${monthlyRentUsd}`;
    }

    // Determine coordinate base from district
    let targetLat = 10.7769;
    let targetLng = 106.7009;
    if (effectiveDistrict.includes('1군')) {
      targetLat = 10.7769;
      targetLng = 106.7009;
    } else if (effectiveDistrict.includes('2군')) {
      targetLat = 10.8035;
      targetLng = 106.7380;
    } else if (effectiveDistrict.includes('7군')) {
      targetLat = 10.7292;
      targetLng = 106.7126;
    } else if (effectiveDistrict.includes('빈탄군')) {
      targetLat = 10.7932;
      targetLng = 106.7218;
    } else if (effectiveDistrict.includes('3군')) {
      targetLat = 10.7845;
      targetLng = 106.6845;
    } else if (effectiveDistrict.includes('4군')) {
      targetLat = 10.7618;
      targetLng = 106.7032;
    }
    // slight random offset so markers don't overlap exactly
    const lat = targetLat + (Math.random() - 0.5) * 0.006;
    const lng = targetLng + (Math.random() - 0.5) * 0.006;

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      category,
      transactionType,
      district: shortDistrictTag,
      title: cleanTitle,
      deposit: Number(depositUsd),
      monthlyRent: Number(monthlyRentUsd),
      priceLabel,
      shortPrice,
      address,
      detailedAddress: specificLocation,
      region: `${shortDistrictTag} ${specificLocation}`,
      lat,
      lng,
      areaPyeong: Number(areaPyeong),
      areaM2: Math.round(Number(areaPyeong) * 3.30578 * 10) / 10,
      floor,
      roomCount,
      direction,
      maintenanceFee: Number(maintenanceFeeUsd),
      maintenanceFeeIncludes: ['수영장·헬스장', '공용관리비', '보안'],
      parking,
      moveInDate,
      images: selectedImages.length > 0 ? selectedImages : [PRESET_SAMPLE_IMAGES[0].url],
      description,
      features: ['호치민 중심가', '풀퍼니처 옵션', '수영장·피트니스', '24시간 보안', '한국어 상담'],
      agent: {
        name: agentName,
        agencyName,
        kakaoId: kakaoId.trim(),
        zaloPhone: zaloPhone.trim(),
        phone: phone.trim(),
        verified: true,
      },
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
      likes: 0,
    };

    onRegister(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">호치민 매물 등록</h2>
              <p className="text-[11px] text-neutral-500">초이스홈 호치민 시험 서비스 매물 등록</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* User Request: 호치민 1군 2군 ~ 특정지역 입력칸 */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-blue-900 block">
                1. 호치민 위치 (1군, 2군 ~ 특정지역) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-blue-700 font-medium">리스트 맨앞 [위치] 자동표시</span>
            </div>

            {/* Quick District Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                '호치민 1군',
                '호치민 2군 (타오디엔)',
                '호치민 7군 (푸미흥)',
                '호치민 빈탄군 (L81)',
                '호치민 3군',
                '호치민 4군',
                '호치민 투득시',
                '직접 입력',
              ].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => {
                    setDistrict(d);
                    if (d.includes('1군')) {
                      setSpecificLocation('빈홈 골든리버 (Aqua 1)');
                      setAddress('02 Tôn Đức Thắng, Bến Nghé, Quận 1, TP. Hồ Chí Minh');
                    } else if (d.includes('2군')) {
                      setSpecificLocation('타오디엔 마스터리 (Masteri Thao Dien)');
                      setAddress('159 Xa Lộ Hà Nội, Thảo Điền, Quận 2, TP. Hồ Chí Minh');
                    } else if (d.includes('7군')) {
                      setSpecificLocation('푸미흥 미드타운 (Midtown M7)');
                      setAddress('Tân Phú, Quận 7, TP. Hồ Chí Minh');
                    } else if (d.includes('빈탄군')) {
                      setSpecificLocation('빈홈 센트럴파크 랜드마크 81');
                      setAddress('720A Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh');
                    }
                  }}
                  className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all truncate ${
                    district === d
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {district === '직접 입력' && (
              <div>
                <input
                  type="text"
                  required
                  value={customDistrict}
                  onChange={(e) => setCustomDistrict(e.target.value)}
                  placeholder="예: 호치민 10군, 호치민 푸년군 등"
                  className="w-full px-3 py-2 rounded-xl border border-blue-300 bg-white text-xs"
                />
              </div>
            )}

            {/* Specific building / neighborhood name */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-700 block mb-1">
                아파트 단지명 / 특정지역 상세명
              </span>
              <input
                type="text"
                required
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="예: 빈홈 골든리버, 마스터리 타오디엔, 미드타운 푸미흥 등"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1.5">
              2. 매물 종류 선택 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['아파트', '빌라', '원룸', '오피스텔', '건물'] as SpecificCategory[]).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title input */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              3. 매물 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 리버뷰 고층 2룸 풀옵션 아파트"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-neutral-900 focus:outline-none transition-all text-xs"
            />
            <p className="text-[10px] text-neutral-400 mt-1">
              등록 시 맨앞에 자동으로 <strong>[{effectiveDistrict.replace(/\(.*\)/, '').trim()}]</strong> 가 추가됩니다.
            </p>
          </div>

          {/* Price inputs (USD or KRW) */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-neutral-800 block">4. 임대 가격 (호치민 표준)</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currency === 'USD' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('KRW')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currency === 'KRW' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  만원 (KRW)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-neutral-500 block mb-1">
                  {currency === 'USD' ? '월세 (USD $)' : '월세 (만원)'}
                </span>
                <input
                  type="number"
                  min="0"
                  step={currency === 'USD' ? 50 : 5}
                  value={monthlyRentUsd}
                  onChange={(e) => setMonthlyRentUsd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  {currency === 'USD'
                    ? `≈ 월 ${Math.round((monthlyRentUsd * 1350) / 10000)}만원`
                    : `${monthlyRentUsd}만원`}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 block mb-1">
                  {currency === 'USD' ? '보증금 (USD $)' : '보증금 (만원)'}
                </span>
                <input
                  type="number"
                  min="0"
                  step={currency === 'USD' ? 100 : 50}
                  value={depositUsd}
                  onChange={(e) => setDepositUsd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  {currency === 'USD' ? `(통상 2개월치 월세)` : `${depositUsd}만원`}
                </span>
              </div>
            </div>
          </div>

          {/* Area, Floor, Rooms */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-neutral-800 block mb-1">전용면적 (평)</label>
              <input
                type="number"
                min="1"
                value={areaPyeong}
                onChange={(e) => setAreaPyeong(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
              />
              <span className="text-[10px] text-neutral-400 mt-0.5 block">
                ≈ {Math.round(areaPyeong * 3.30578 * 10) / 10}㎡
              </span>
            </div>
            <div>
              <label className="font-bold text-neutral-800 block mb-1">층수</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-neutral-800 block mb-1">방/욕실 구조</label>
              <input
                type="text"
                value={roomCount}
                onChange={(e) => setRoomCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
              />
            </div>
          </div>

          {/* Representative Photo */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1.5">5. 대표 사진 선택</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_SAMPLE_IMAGES.map((img, idx) => {
                const isSelected = selectedImages.includes(img.url);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedImages([img.url])}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer aspect-square ${
                      isSelected ? 'border-neutral-900 shadow-sm' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent Info (Kakao & Zalo) */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2.5">
            <span className="font-bold text-neutral-900 block text-xs">
              6. 호치민 담당자 직통 연락처 (카카오톡 & Zalo 안내)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-neutral-500 block mb-0.5">담당자 성함</span>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block mb-0.5">중개사무소 명</span>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-amber-700 block mb-0.5">
                  카카오톡 ID (KakaoTalk)
                </span>
                <input
                  type="text"
                  required
                  value={kakaoId}
                  onChange={(e) => setKakaoId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-semibold"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 block mb-0.5">
                  Zalo 전화번호 (Zalo / 베트남폰)
                </span>
                <input
                  type="text"
                  required
                  value={zaloPhone}
                  onChange={(e) => setZaloPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-blue-300 bg-white text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>호치민 매물 등록 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
