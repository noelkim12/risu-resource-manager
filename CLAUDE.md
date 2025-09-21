# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RisuAI Resource Manager is a SvelteKit web application for managing RisuAI file formats (.risup, .risum, .charx). It features a modern tabbed interface with file parsing, viewing, and editing capabilities, plus persistent storage using LocalForage.

### Tech Stack
- **Framework**: SvelteKit v2.22.0 + Svelte 5.0
- **Styling**: Tailwind CSS v4.1.13 + DaisyUI v5.1.10 + @tailwindcss/vite v4.1.13
- **Icons**: Lucide Svelte
- **Storage**: LocalForage (IndexedDB/WebSQL/localStorage fallback)
- **Testing**: Playwright E2E + Storybook
- **Build**: Vite v7.0.4

### Key Dependencies
- **File Processing**: msgpackr, @msgpack/msgpack, fflate, buffer
- **UI Components**: Custom component library + lucide-svelte
- **Development**: TypeScript, ESLint, Prettier
- **CSS Processing**: @tailwindcss/postcss v4.1.13, @tailwindcss/vite v4.1.13, autoprefixer

### Package Manager Configuration
- **Manager**: npm (pnpm supported with onlyBuiltDependencies: ["esbuild"])
- **Node Type**: ESM (type: "module")
- **Private**: true (not published to npm registry)

## Development Commands

### Core Development
```bash
npm run dev              # Start development server
npm run dev -- --open   # Start dev server and open browser
npm run build            # Build for production
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run lint             # Run prettier and eslint checks
npm run format           # Format code with prettier
npm run check            # Type check with svelte-check
npm run check:watch      # Type check in watch mode
```

### Testing
```bash
npm run test             # Run all tests (currently just e2e)
npm run test:e2e         # Run Playwright e2e tests
```

### Storybook
```bash
npm run storybook        # Start Storybook dev server on port 6006
npm run build-storybook  # Build Storybook for production
```

## Project Structure

```
risu-editor/
├── src/
│   ├── routes/
│   │   └── +page.svelte              # Main app entry point
│   ├── components/
│   │   ├── panels/                   # Layout panels
│   │   │   ├── HeaderPanel.svelte    # Top header with stats and tabs
│   │   │   ├── LeftPanel.svelte      # File list and uploader (DELETED)
│   │   │   ├── CenterPanel.svelte    # File viewer area
│   │   │   └── RightPanel.svelte     # Key-value detail viewer
│   │   ├── viewers/                  # File-type specific viewers
│   │   │   ├── DefaultViewer.svelte  # Default/fallback viewer
│   │   │   ├── charx/
│   │   │   │   └── CharxViewer.svelte # .charx file key browser
│   │   │   ├── risum/
│   │   │   │   └── RisumViewer.svelte # .risum file key browser
│   │   │   └── risup/
│   │   │       ├── RisupViewer.svelte # .risup file key browser
│   │   │       └── RisupDetail.svelte # .risup detailed viewer
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── common/               # Common UI components
│   │   │   │   ├── Accordion.svelte  # Accordion component
│   │   │   │   ├── AlertDialog.svelte # Modal dialog
│   │   │   │   ├── Badge.svelte      # Badge/tag component
│   │   │   │   ├── Button.svelte     # Base button component
│   │   │   │   ├── ViewerButton.svelte # Viewer-specific button
│   │   │   │   ├── forms/            # Form components
│   │   │   │   │   ├── CheckInput.svelte # Checkbox input (DELETED)
│   │   │   │   │   └── TextInput.svelte # Text input
│   │   │   │   └── others/
│   │   │   │       └── Help.svelte   # Help/info component
│   │   │   └── risup/                # Risup-specific UI components
│   │   │       └── ModelList.svelte  # Model list component
│   │   ├── FileUploader.svelte       # Drag & drop file handler
│   │   ├── FileList.svelte           # File listing component
│   │   ├── FileViewer.svelte         # Main file viewer component
│   │   └── App.svelte                # Main app component
│   ├── lib/                          # Business logic and utilities
│   │   ├── storage/                  # Persistent storage system
│   │   │   └── index.ts              # LocalForage-based data persistence
│   │   ├── stores/                   # Svelte stores
│   │   │   ├── risup.store.ts        # Risup file store
│   │   │   ├── selection.store.ts    # Selection state store
│   │   │   └── stores.svelte.ts      # Main stores (DELETED)
│   │   ├── styles/                   # Style utilities and tokens
│   │   │   ├── component-utils.ts    # Component styling utilities
│   │   │   ├── tokens.ts             # Design tokens
│   │   │   └── ComponentTemplate.svelte # Component template
│   │   ├── utils/                    # General utilities
│   │   │   ├── debounce.ts           # Debouncing utility
│   │   │   └── alert.ts              # Alert utilities
│   │   ├── i18n/                     # Internationalization
│   │   │   ├── index.ts              # i18n main module
│   │   │   ├── en.ts                 # English translations
│   │   │   ├── ko.ts                 # Korean translations
│   │   │   ├── cn.ts                 # Chinese (Simplified) translations
│   │   │   ├── zh-Hant.ts           # Chinese (Traditional) translations
│   │   │   ├── de.ts                 # German translations
│   │   │   ├── es.ts                 # Spanish translations
│   │   │   └── vi.ts                 # Vietnamese translations
│   │   ├── templates/                # Default templates and structures
│   │   │   ├── defaultPrompts.ts     # Default prompts
│   │   │   ├── prebuiltTemplates.ts  # Prebuilt templates
│   │   │   └── risupTemplate.ts      # Risup template
│   │   ├── risup/                    # .risup file processing
│   │   │   ├── index.ts              # Main processor
│   │   │   └── crypto.ts             # AES-GCM encryption/decryption
│   │   ├── risum/                    # .risum file processing (WIP)
│   │   │   ├── index.ts              # Binary format processor
│   │   │   └── binary-helper.ts      # Binary read/write utilities
│   │   ├── charx/                    # .charx file processing (WIP)
│   │   │   └── index.ts              # ZIP-based processor
│   │   ├── rpack/                    # Custom compression format
│   │   │   └── rpack_bg.js           # WebAssembly RPack implementation
│   │   ├── common/                   # Shared utilities (EMPTY)
│   │   ├── assets/                   # Static assets (EMPTY)
│   │   └── index.ts                  # Main lib export
│   ├── types/                        # TypeScript definitions
│   │   ├── storage/                  # Storage-related types
│   │   └── risu/                     # RisuAI-specific type definitions
│   │       ├── character/            # Character type definitions
│   │       ├── llm/                  # LLM type definitions
│   │       │   └── rag/              # RAG-specific types
│   │       ├── system/               # System type definitions
│   │       └── tools/                # Tool type definitions
│   │           ├── additionalmodel/  # Additional model types
│   │           └── stablediffusion/  # Stable Diffusion types
│   ├── stories/                      # Storybook stories
│   │   └── assets/                   # Story assets
│   └── app.d.ts                      # App type definitions
├── static/                           # Static assets
├── .storybook/                       # Storybook configuration
├── .vscode/                          # VS Code configuration
├── e2e/                              # Playwright E2E tests
├── example/                          # Example files
├── docs/                             # Documentation
└── postcss.config.js                # PostCSS configuration
```

## Architecture Overview

### File Format Processing Pipeline

The application handles three RisuAI file formats with distinct processing chains:

**1. .risup Files (Encrypted Presets)** ✅ Implemented
- **Pipeline**: RPack decompression → fflate decompression → MessagePack container → AES-GCM decryption → MessagePack preset data
- **Key files**: `src/lib/risup/index.ts`, `src/lib/risup/crypto.ts`
- **Dependencies**: msgpackr, fflate, Web Crypto API, custom RPack (WebAssembly)

**2. .risum Files (Module Packages)** ⚠️ Partial (Structure only)
- **Pipeline**: Binary header parsing → RPack decompression → JSON module data + compressed assets
- **Key files**: `src/lib/risum/index.ts`, `src/lib/risum/binary-helper.ts`
- **Format**: Custom binary format with magic number (111), version, length-prefixed blocks

**3. .charx Files (Character Packages)** ⚠️ Partial (Structure only)
- **Pipeline**: ZIP decompression → card.json + module.risum + asset files
- **Key files**: `src/lib/charx/index.ts`
- **Dependencies**: fflate for ZIP handling

### Storage Architecture

**LocalForage-based Persistence**:
- **Primary Storage**: IndexedDB (with WebSQL/localStorage fallback)
- **Data Separation**: File metadata separate from parsed content
- **Auto-cleanup**: Size limits and retention policies
- **Debounced Saves**: 500ms debouncing to prevent excessive storage calls

### UI Architecture

**Responsive Multi-panel Layout** (2:2:6 ratio when right panel open):
- **Header**: Logo, file statistics, tab navigation with file type filtering
- **Left Panel**: File uploader + filtered file list (sticky, tab-filtered uploads)
- **Center Panel**: File-type specific key browsers (risup/risum/charx viewers)
- **Right Panel**: Animated key-value detail viewer (slides from right, sticky)

**Component Hierarchy**:
```
+page.svelte (State management + LocalForage integration)
├── HeaderPanel (Stats, tabs, actions)
├── LeftPanel (FileUploader + FileList)
├── CenterPanel (File-type specific viewers)
│   ├── RisupViewer (Key browser for .risup files)
│   ├── RisumViewer (Key browser for .risum files)
│   └── CharxViewer (Key browser for .charx files)
└── RightPanel (Key-value detail viewer)
```

### State Management

**Svelte Stores with Persistence**:
- `files` - Array of uploaded file objects with parsed content (persisted)
- `selectedFileId` - Currently selected file ID (persisted)
- `activeTab` - Current filter tab: 'risup' | 'risum' | 'charx' (persisted)
- `leftPanelOpen` - Panel visibility state (persisted)
- `rightPanelVisible` - Right panel visibility (persisted)
- `selectedKey/selectedValue` - Right panel content (persisted)

**File-Type Specific Stores** (Recommended Architecture):
- `src/lib/stores/risup.store.ts` - Risup 파일 전용 store (BotPreset 타입 기반)
- `src/lib/stores/risum.store.ts` - Risum 파일 전용 store (향후 구현)
- `src/lib/stores/charx.store.ts` - Charx 파일 전용 store (향후 구현)

**Common Shared Stores**:
- `src/lib/stores/selection.store.ts` - 파일/필드 선택 상태 (모든 파일 타입 공통)

**Store 관리 정책**:
1. **확장자별 전용 store**: 각 파일 타입마다 별도 store 생성 (타입 안정성 확보)
2. **공통 선택 store**: 파일 ID, 파일 타입, 필드 키 선택 상태는 selection.store에서 통합 관리
3. **직접 업데이트**: 이벤트 체인 대신 컴포넌트에서 store 직접 업데이트
4. **자동 저장소 동기화**: store 업데이트 시 risuStorage 자동 호출
5. **derived store 활용**: currentContent = derived([selectedId, contents]) 패턴 사용
6. **props vs store 우선순위**: store 우선, props는 백업/초기화 용도
7. **props 체이닝 제거**: fileId, fieldKey 등은 selection store에서 자동 가져오기

**File Object Structure**:
```typescript
{
  id: string,                    // crypto.randomUUID()
  name: string,                  // Original filename
  type: 'risup' | 'risum' | 'charx',  // File extension
  size: number,                  // File size in bytes
  uploadedAt: Date,              // Upload timestamp
  content: string | Uint8Array,  // Raw file content (not persisted)
  parsedContent?: object,        // Parsed/decoded content (persisted separately)
  parseError?: string           // Parse error message if failed (persisted)
}
```

## Key Implementation Details

### File Processing Strategy
- **.risup files**: Read as binary (Uint8Array) due to encryption and compression
- **Other files**: Read as text initially, with binary fallback planned
- **Error handling**: Multi-stage parsing with detailed console logging for debugging
- **Async processing**: All file operations use Promises with proper error boundaries

### WebAssembly Integration
- **RPack compression**: Custom WASM module at `src/lib/rpack/rpack_bg.js`
- **Initialization**: Lazy-loaded when first RPack operation is called
- **Browser compatibility**: Fallback strategies for unsupported browsers

### Modern UI Features
- **Glassmorphism**: Backdrop blur effects with transparency
- **Gradient backgrounds**: Multi-layer visual depth
- **Responsive design**: Mobile-first with progressive enhancement
- **Custom styling**: Tailwind CSS v4 with custom component styles

### Tailwind CSS v4 Configuration
- **Build Integration**: @tailwindcss/vite plugin handles compilation
- **PostCSS Setup**: @tailwindcss/postcss for CSS processing
- **CSS Import**: Simple `@import "tailwindcss";` in app.css
- **Plugins**: @tailwindcss/forms, @tailwindcss/typography
- **No Config File**: Uses zero-config approach with @tailwindcss/vite
- **Utilities**: All standard utilities including `group`, `@apply` directive supported

## Common Development Patterns

### Adding New File Format Support
1. Create parser module in `src/lib/[format]/index.ts`
2. Export async `import[Format]()` and `export[Format]()` functions
3. Add format detection in `FileUploader.svelte` processFiles function
4. Update file type styling in UI components
5. Add format-specific visualization in `FileViewer.svelte`

### Component Development
- Follow existing Svelte 5 patterns with script/markup/style structure
- Use Lucide Svelte for icons consistency
- Include accessibility attributes (ARIA labels, keyboard navigation)
- **TypeScript 사용 규칙**: `<script lang="ts">` 명시 시 TypeScript 타입 어노테이션 사용 가능

#### UI 컴포넌트 표준화 시스템

**1. 디자인 토큰 시스템** (`src/lib/styles/tokens.ts`)
- 색상, 크기, 간격, 타이포그래피 등 표준 토큰 정의
- CSS 변수 기반으로 다크모드 자동 지원
- TypeScript 타입 안전성 제공

**2. 스타일 유틸리티** (`src/lib/styles/component-utils.ts`)
- `getButtonStyles()`, `getInputStyles()`, `getBadgeStyles()` 등 컴포넌트별 스타일 함수
- `cn()` 클래스명 조합 유틸리티
- `focusRing`, `animations`, `layouts` 등 공통 스타일 상수

**3. 컴포넌트 개발 규칙**
```typescript
// ✅ 표준 Props 인터페이스
interface Props {
  variant?: ButtonVariant;     // 필수: 컴포넌트 변형
  size?: ButtonSize;          // 필수: 크기 옵션
  disabled?: boolean;         // 필수: 비활성화 상태
  className?: string;         // 필수: 추가 클래스 허용
  ariaLabel?: string;         // 권장: 접근성
}

// ✅ 스타일 유틸리티 사용
$: classes = cn(
  getButtonStyles(variant, size),
  className
);

// ✅ 접근성 속성 필수
<button
  aria-label={ariaLabel}
  aria-disabled={disabled}
  tabindex={disabled ? -1 : 0}
  {...$$restProps}
>
```

**4. 컴포넌트 생성 프로세스**
1. `src/lib/styles/ComponentTemplate.svelte` 복사
2. Props 인터페이스를 컴포넌트에 맞게 수정
3. 적절한 스타일 함수 선택 또는 새로 생성
4. 접근성 속성 및 키보드 내비게이션 구현
5. 컴포넌트별 디자인 토큰 활용

**5. 스타일 우선순위**
1. **Tailwind 클래스** - 기본 스타일링
2. **디자인 토큰** - CSS 변수 활용
3. **유틸리티 함수** - 복잡한 variant/size 조합
4. **인라인 스타일** - 최후의 수단 (지양)

**6. TypeScript 컴포넌트 예시**
```typescript
// ✅ TypeScript 사용 시 (lang="ts" 명시)
<script lang="ts">
  import { cn, getButtonStyles } from "../../lib/styles/component-utils";
  import type { ButtonVariant, ButtonSize } from "../../lib/styles/tokens";

  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    className?: string;
  }

  let { variant = "default", size = "md", disabled = false, className = "" }: Props = $props();

  $: classes = cn(getButtonStyles(variant, size), className);
</script>

// ✅ JavaScript 사용 시 (JSDoc 주석으로 타입 힌트)
<script>
  /**
   * @param {string} key - 표시할 키 이름
   * @param {any} value - 키에 해당하는 값
   * @param {"risup" | "risum" | "charx"} fileType - 파일 타입
   */
  export let key = "";
  export let value = null;
  export let fileType = "risup";
</script>
```
- **Import 경로 규칙**: 상대경로 사용 필수
  ```typescript
  // ✅ 올바른 예시 (상대경로)
  import type { BotPreset } from "../../types/risu/preset.types";
  import { risuStorage } from "../storage";
  import ModelList from "../../ui/risup/ModelList.svelte";

  // ❌ 잘못된 예시 (SvelteKit alias)
  import type { BotPreset } from "$types/risu/preset.types";
  import { risuStorage } from "$lib/storage";
  import ModelList from "$lib/ui/risup/ModelList.svelte";
  ```

### File-Type Specific Store Development
1. **Store 생성**: `src/lib/stores/[format].store.ts` 파일 생성
2. **타입 정의**: 해당 파일 타입에 맞는 TypeScript 인터페이스 사용 (상대경로)
3. **Store 구조**:
   ```typescript
   import { writable, derived } from "svelte/store";
   import type { FileType } from "../../types/risu/[format].types";
   import { risuStorage } from "../storage";

   export const selected[Format]FileId = writable<string | null>(null);
   export const [format]Contents = writable<Record<string, FileType>>({});
   export const current[Format]Content = derived([selected[Format]FileId, [format]Contents], ...);
   export const [format]Store = { selectFile, setContent, updateKey, removeFile, clear };
   ```
4. **Selection Store 연동**: selection.store의 currentSelection 사용하여 props 체이닝 제거
   ```typescript
   import { currentSelection } from "../../../lib/stores/selection.store";

   // changeModel 함수에서
   const selection = $currentSelection;
   if (selection.isComplete && selection.fileType === 'format') {
     formatStore.updateKey(selection.fileId, selection.fieldKey, value);
   }
   ```
5. **컴포넌트 연동**: props 대신 selection store에서 fileId, fieldKey 자동 가져오기
6. **저장소 동기화**: updateKey 함수에서 risuStorage.saveParsedContent 자동 호출
7. **Import 주의**: 모든 import문에서 상대경로 사용 (`../`, `../../` 등)

### Debugging File Parsing
- All parsers include detailed console logging
- Check browser DevTools Console for step-by-step parsing progress
- Binary file issues often occur at RPack decompression or crypto operations
- Text encoding/decoding problems typically surface during final MessagePack parsing

## Codebase Rules
- 변경 제안은 **파일 전체가 아니라 diff 패치**로 제시.
- Svelte 5 runes 문법 준수. 컴포넌트 분리 시 props/스토어 최소화.
- **Svelte 컴포넌트 타입**: `<script lang="ts">` 사용 시 TypeScript 타입 어노테이션 권장, JavaScript 사용 시 JSDoc 주석으로 타입 힌트 제공
- Vite 플러그인/설정 수정은 `vite.config.*` 한정, 불필요한 플러그인 추가 금지.
- **Tailwind CSS v4 준수**: @tailwindcss/vite + @tailwindcss/postcss 조합 사용, `@import "tailwindcss";` 단일 import
- **패키지 의존성**: package.json 확인 후 설치된 패키지만 사용, 임의 패키지 추가 금지
- Storybook/Playwright 관련 수정은 **요청 시에만** 건드림(토큰 절약 목적).
- 빌드·프리뷰 실행 지시 금지: 스크립트 실행은 사람이 수동으로 함.
- **Import 경로**: 상대경로 사용 필수 (다른 프로젝트 import 대비). `$lib/`, `$types/` 등 SvelteKit alias 사용 금지.

## Scope & Files
- 기본 작업 범위: `src/**`, `tailwind.config.*`, `svelte.config.*`, `vite.config.*`, `postcss.config.*`, `package.json`  
- 제외: 산출물/바이너리/의존성/테스트 산출물

## Task Style
- 설명은 3~5줄 이하 요약 + 코드 diff.
- 대규모 리팩터는 **단계별 PR 단위** 제안.

## Commit/Branch (예시)
- feat:, fix:, refactor:, chore: 컨벤션 준수.
- 테스트/스토리 추가는 별 커밋으로 분리.

## Architecture Hints
- I/O 경계(파일/네트워크/스토리지) 레이어 분리.
- UI 상태는 Svelte stores로, 비즈 로직은 별 모듈로.
- **Store 아키텍처**: 파일 타입별 전용 store + 공통 selection store 조합 사용.
- **Props 체이닝 제거**: fileId, fieldKey 등은 selection store를 통해 자동 전달.
- **데이터 흐름**: Component → Selection Store → File-Type Store → Storage 단방향 흐름.
- **타입 안정성**: 각 파일 포맷의 TypeScript 인터페이스를 store에서 강제.
- **확장성**: selection store는 모든 파일 타입(risup, risum, charx)에서 공통 사용.