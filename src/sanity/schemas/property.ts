// Sanity Studio 간소화된 매물(Property) 스키마 정의 (화폐: VND 베트남동)
export const propertySchema = {
  name: 'property',
  title: '매물 관리 (Properties)',
  type: 'document',
  fields: [
    // 1. 기본 정보
    {
      name: 'title',
      title: '매물 제목',
      type: 'string',
      description: '예: [2군 타오디엔] 마스테리 리버뷰 고층 풀옵션',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: '매물 종류',
      type: 'string',
      options: {
        list: [
          { title: '아파트', value: '아파트' },
          { title: '빌라', value: '빌라' },
          { title: '주택/단독', value: '주택/단독' },
          { title: '원룸', value: '원룸' },
          { title: '오피스텔', value: '오피스텔' },
          { title: '건물', value: '건물' },
        ],
        layout: 'radio',
      },
      initialValue: '아파트',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'transactionType',
      title: '거래 유형',
      type: 'string',
      options: {
        list: [
          { title: '월세', value: '월세' },
          { title: '매매', value: '매매' },
          { title: '전세', value: '전세' },
        ],
        layout: 'radio',
      },
      initialValue: '월세',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'district',
      title: '지역구',
      type: 'string',
      description: '예: 호치민 2군 (타오디엔), 호치민 7군 (푸미흥), 1군, 빈탄군',
      validation: (Rule: any) => Rule.required(),
    },

    // 2. 가격 정보 (VND 베트남동 기준)
    {
      name: 'priceLabel',
      title: '월세 / 가격 (VND)',
      type: 'string',
      description: '예: 월 3,500만동 또는 3500만동 / 매매 65억동',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'deposit',
      title: '보증금 (한글 자유 입력)',
      type: 'string',
      description: '예: 2개월(7000만동), 1개월(3500만동), 2개월분(협의가능)',
      initialValue: '2개월(7000만동)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'monthlyRent',
      title: '월세 (선택)',
      type: 'string',
      description: '필요 시 별도 기재',
    },
    {
      name: 'shortPrice',
      title: '요약 가격 (선택)',
      type: 'string',
      description: '미입력 시 월세/가격이 자동으로 사용됩니다',
    },

    // 3. 매물 사진 (여러 장 드래그&드롭)
    {
      name: 'images',
      title: '매물 사진들',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: '첫 번째 사진이 대표 썸네일로 사용됩니다.',
    },

    // 4. 위치 정보
    {
      name: 'address',
      title: '주소 또는 도로명',
      type: 'string',
      description: '예: 159 Xa lo Ha Noi, Thao Dien',
    },
    {
      name: 'detailedAddress',
      title: '상세 주소 (건물명, 동/호수 등)',
      type: 'string',
      description: '예: KDC Sadeco Phước Kiển, Xã Nhà Bè, TPHCM',
    },
    {
      name: 'region',
      title: '지역명 (동/군)',
      type: 'string',
      description: '예: 호치민 7군 냐베',
    },
    {
      name: 'lat',
      title: '위도 (선택)',
      type: 'number',
      description: '지도 핀 위치 (미입력 시 기본 호치민 중심 좌표)',
      initialValue: 10.8035,
    },
    {
      name: 'lng',
      title: '경도 (선택)',
      type: 'number',
      description: '지도 핀 위치',
      initialValue: 106.7381,
    },

    // 5. 매물 구조 및 상세
    {
      name: 'areaM2',
      title: '전용면적 (m²)',
      type: 'number',
      description: '예: 75 (m² 입력 시 평수는 자동 계산됩니다)',
    },
    {
      name: 'roomCount',
      title: '방 및 욕실 수',
      type: 'string',
      description: '예: 방 2 · 욕실 2',
      initialValue: '방 2 · 욕실 2',
    },
    {
      name: 'floor',
      title: '층수',
      type: 'string',
      description: '예: 15층 / 25층 또는 고층',
    },
    {
      name: 'maintenanceFee',
      title: '관리비',
      type: 'string',
      description: '예: 150만동 또는 관리비 포함',
      initialValue: '포함',
    },
    {
      name: 'parking',
      title: '주차 가능 여부',
      type: 'string',
      initialValue: '가능 (월 주차비 별도)',
    },
    {
      name: 'moveInDate',
      title: '입주 가능일',
      type: 'string',
      initialValue: '즉시 입주',
    },

    // 6. 상세 설명 & 특징
    {
      name: 'description',
      title: '매물 상세 설명',
      type: 'text',
      rows: 4,
      description: '옵션 상태, 뷰, 주변 편의시설 등 안내글을 적어주세요.',
    },
    {
      name: 'features',
      title: '주요 특징 태그',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: '예: 풀옵션, 리버뷰, 수영장, 역세권, 신축',
    },

    // 7. 담당자 정보
    {
      name: 'agent',
      title: '담당 공인중개사 정보',
      type: 'object',
      fields: [
        { name: 'name', title: '중개사 성함', type: 'string', initialValue: '김부장' },
        { name: 'agencyName', title: '부동산 상호', type: 'string', initialValue: '호치민 글로벌 부동산' },
        { name: 'kakaoId', title: '카카오톡 ID', type: 'string' },
        { name: 'zaloPhone', title: 'Zalo / 전화번호', type: 'string' },
        { name: 'phone', title: '연락처', type: 'string' },
        { name: 'verified', title: '인증된 중개사 뱃지 표시', type: 'boolean', initialValue: true },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'priceLabel',
      media: 'images.0',
    },
  },
};
