# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RisuAI Resource Manager is a SvelteKit web application for managing RisuAI file formats (.risup, .risum, .charx). It features a modern tabbed interface with file parsing, viewing, and editing capabilities, plus persistent storage using LocalForage.

### Tech Stack
- **Framework**: SvelteKit v2.22.0 + Svelte 5.0
- **Styling**: Tailwind CSS v4.1.13 + DaisyUI v5.1.10
- **Icons**: Lucide Svelte
- **Storage**: LocalForage (IndexedDB/WebSQL/localStorage fallback)
- **Testing**: Playwright E2E + Storybook
- **Build**: Vite v7.0.4

### Key Dependencies
- **File Processing**: msgpackr, fflate, buffer
- **UI Components**: Custom component library
- **Development**: TypeScript, ESLint, Prettier

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
│   │   │   ├── LeftPanel.svelte      # File list and uploader
│   │   │   ├── CenterPanel.svelte    # File viewer area
│   │   │   └── RightPanel.svelte     # Key-value detail viewer
│   │   ├── viewers/                  # File-type specific viewers
│   │   │   ├── RisupViewer.svelte    # .risup file key browser
│   │   │   ├── RisumViewer.svelte    # .risum file key browser
│   │   │   └── CharxViewer.svelte    # .charx file key browser
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.svelte         # Base button component
│   │   │   ├── Badge.svelte          # Badge/tag component
│   │   │   └── AlertDialog.svelte    # Modal dialog
│   │   ├── FileUploader.svelte       # Drag & drop file handler
│   │   └── FileList.svelte           # File listing component
│   ├── lib/                          # Business logic and utilities
│   │   ├── storage/                  # Persistent storage system
│   │   │   └── index.ts              # LocalForage-based data persistence
│   │   ├── utils/                    # General utilities
│   │   │   └── debounce.ts           # Debouncing utility
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
│   │   └── common/                   # Shared utilities
│   │       └── templates/            # Default templates and structures
│   └── types/                        # TypeScript definitions
│       ├── storage/                  # Storage-related types
│       └── risu/                     # RisuAI-specific type definitions
├── static/                           # Static assets
├── .storybook/                       # Storybook configuration
├── e2e/                              # Playwright E2E tests
└── docs/                             # Documentation
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
- Implement proper TypeScript interfaces for props
- Include accessibility attributes (ARIA labels, keyboard navigation)

### Debugging File Parsing
- All parsers include detailed console logging
- Check browser DevTools Console for step-by-step parsing progress
- Binary file issues often occur at RPack decompression or crypto operations
- Text encoding/decoding problems typically surface during final MessagePack parsing

## Codebase Rules
- 변경 제안은 **파일 전체가 아니라 diff 패치**로 제시.
- Svelte 5 runes 문법 준수. 컴포넌트 분리 시 props/스토어 최소화.
- Vite 플러그인/설정 수정은 `vite.config.*` 한정, 불필요한 플러그인 추가 금지.
- Tailwind v4 기준: class 정렬은 Prettier 플러그인에 위임, 임의 포맷 금지.
- Storybook/Playwright 관련 수정은 **요청 시에만** 건드림(토큰 절약 목적).
- 빌드·프리뷰 실행 지시 금지: 스크립트 실행은 사람이 수동으로 함.

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