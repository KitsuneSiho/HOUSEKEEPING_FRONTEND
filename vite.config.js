import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // 클래스 이름 형식 설정: camelCase로 변경
      localsConvention: 'camelCaseOnly', // 클래스 이름을 camelCase로 변환
      // CSS 모듈 클래스 이름 패턴 설정
      generateScopedName: '[name]__[local]___[hash:base64:5]', // 파일명, 로컬 클래스명, 해시
      // 자동 CSS 모듈 규칙
      auto: (resourcePath) => /\.module\.\w+$/i.test(resourcePath), // .module.css 확장자 파일만 모듈로 처리
    }
  }
})
