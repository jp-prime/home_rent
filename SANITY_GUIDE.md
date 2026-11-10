# 🏠 세니티(Sanity) 매물 관리자 연동 가이드

초이스홈(ChoiceHome) 프로젝트에 **Sanity CMS 연동 설정**이 완료되었습니다!  
아래 3단계만 따라 하시면 무료로 매물 등록/수정 관리자 웹페이지를 운영하실 수 있습니다.

---

## 1단계: Sanity 무료 계정 및 프로젝트 ID 발급받기 (약 1분 소요)

1. [https://www.sanity.io](https://www.sanity.io) 접속 후 **[Get started]** 클릭 (Google 또는 GitHub 계정으로 간편 가입)
2. 로그인 후 [Manage Console](https://www.sanity.io/manage)로 이동하여 **[Create project]** (프로젝트 생성) 클릭
3. 생성된 프로젝트의 **Project ID**를 복사합니다. (예: `abc123xy`)
4. 데이터셋(Dataset)은 기본값인 `production`을 그대로 사용하시면 됩니다.

---

## 2단계: 환경 변수(Project ID) 등록하기

### 💻 로컬 환경 (.env)
프로젝트 루트의 `.env` 파일을 열고 복사한 Project ID를 입력합니다:
```env
VITE_SANITY_PROJECT_ID="복사한_Project_ID"
VITE_SANITY_DATASET="production"
```

### ☁️ Vercel 호스팅 환경
1. [Vercel 대시보드](https://vercel.com)에서 해당 프로젝트 클릭
2. **Settings** 탭 > **Environment Variables** 클릭
3. 아래 두 변수를 추가합니다:
   - `VITE_SANITY_PROJECT_ID` = `복사한_Project_ID`
   - `VITE_SANITY_DATASET` = `production`
4. GitHub에 푸시하여 새 버전을 배포(Redeploy)하면 자동으로 Vercel 사이트와 연동됩니다!

---

## 3단계: 매물 등록 관리자 페이지(Sanity Studio) 실행 & 배포하기

### 🚀 관리자 페이지 로컬에서 실행하기
터미널에서 아래 명령어를 실행하면 브라우저에서 바로 관리자 페이지가 열립니다:
```bash
npx sanity dev
```
(브라우저에서 `http://localhost:3333` 접속)

### 🌐 관리자 페이지 무료 웹 배포 (스마트폰/외부 접속용)
관리자 페이지를 웹상에 무료로 배포하여 언제 어디서든 매물을 등록하려면:
```bash
npx sanity deploy
```
- 원하는 주소 서브도메인을 입력하면 (예: `choicehome`),  
  `https://choicehome.sanity.studio` 주소로 전용 관리자 페이지가 즉시 배포됩니다!
- Sanity 계정으로 로그인한 관리자만 매물을 등록/수정/삭제할 수 있습니다.

---

## 📋 Sanity에서 입력 가능한 매물 항목
- **기본 정보**: 매물 제목, 매물 종류(아파트/빌라/원룸/오피스텔/건물), 거래 유형(월세/전세/매매), 지역구
- **가격 정보**: 표시 가격, 요약 가격, 보증금(숫자), 월세(숫자)
- **위치 정보**: 도로명 주소, 상세 주소, 위도(lat), 경도(lng)
- **매물 상세**: 전용면적(평, m²), 층수, 방/욕실 수, 방향, 관리비, 주차, 입주가능일
- **사진 업로드**: 여러 장의 사진 드래그&드롭 (첫 번째 사진이 대표 썸네일)
- **특징 및 설명**: 상세 설명글, 태그(풀옵션, 역세권 등)
- **중개사 정보**: 이름, 상호명, 카톡 ID, Zalo/전화번호 등
