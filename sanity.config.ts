import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

// Sanity Studio 설정
// npx sanity dev 를 실행하면 관리자 화면(Studio)이 로컬에서 실행되며,
// npx sanity deploy 를 실행하면 내이름.sanity.studio 에 무료로 배포됩니다.
export default defineConfig({
  name: 'default',
  title: '초이스홈 매물 관리자 (ChoiceHome Studio)',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'vbgjfzkl',
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
