# SvelteKit 최신 버전 설치 가이드 (2025 업데이트)

이 문서는 최신 Svelte CLI를 사용하여 SvelteKit 프로젝트를 시작하는 공식적인 방법을 안내합니다.  
이 가이드는 RisuAI 프로젝트와의 호환성을 고려하면서도, 항상 **최신 SvelteKit + Tailwind v4 환경**을 구성할 수 있도록 돕습니다.

---

### 단계 0: 최신 SvelteKit 프로젝트 생성

#### 1. SvelteKit 프로젝트 생성

-   **`npx sv create`** 명령어를 사용하여 프로젝트 생성을 시작합니다.
-   이 명령어는 대화형 프롬프트를 통해 프로젝트의 기본 설정을 안내합니다.

    ```bash
    # "risu-editor"는 원하는 프로젝트 이름으로 변경하세요.
    npx sv create risu-editor
    ```

-   프롬프트가 나타나면 다음과 같이 설정하는 것을 권장합니다.
    1.  **Which Svelte app template?** › `SvelteKit App (skeleton)`
    2.  **Add type checking with TypeScript?** › `Yes, using TypeScript syntax`
    3.  **Select additional options** › `ESLint`, `Prettier`, `Playwright` 등을 필요에 따라 선택합니다.

#### 2. 의존성 설치 및 개발 서버 실행

```bash
cd risu-editor
npm install
npm run dev
```

---

### 단계 1: 추가 라이브러리 설치 (RisuAI 호환성)

#### 1. 핵심 라이브러리 설치

```bash
npm install fflate msgpackr
```

#### 2. UI 및 스타일링 라이브러리 설치 (Tailwind v4 기준)

- TailwindCSS v4는 `postcss` / `autoprefixer` 설정이 필요 없음  
- DaisyUI, Lucide Icons는 여전히 사용 가능

```bash
npm install -D tailwindcss @tailwindcss/vite daisyui lucide-svelte
```

#### 3. Vite 설정 수정

`vite.config.ts` 또는 `vite.config.js`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()]
});
```

#### 4. TailwindCSS 적용

- Tailwind v4는 `npx tailwindcss init -p` 필요 없음  
- 전역 스타일 파일(`src/app.css`)에 추가:

```css
@import "tailwindcss";
```

- DaisyUI 활성화를 원한다면 `tailwind.config.js` 생성 후 플러그인 추가:

```bash
npx tailwindcss init
```

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: { extend: {} },
  plugins: [require('daisyui')],
}
```

---

### 단계 2: 이후 개발

초기 환경 구성이 완료되었습니다.  
이제 Svelte 5의 Runes를 기반으로 컴포넌트를 개발하고, 상태 관리를 구현하며, RisuAI의 핵심 로직을 포팅하는 등 본격적인 개발을 진행할 수 있습니다.
