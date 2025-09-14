# `.risup` 파싱/익스포트 로직 체리피킹 가이드

이 문서는 `RisuAI` 프로젝트에서 `.risup` 프리셋 파일을 처리하는 로직을 분리하여 다른 프로젝트에 적용하기 위한 기술 가이드라인을 제공합니다.

`.risup` 파일은 JSON 데이터를 **MessagePack 인코딩 → AES-GCM 암호화 → fflate 압축 → RPack 압축**의 과정을 거쳐 생성된 복합 바이너리 파일입니다.

---

## 핵심 의존성 및 함수

체리피킹을 위해 다음 라이브러리와 내부 함수들이 필요합니다.

1.  **라이브러리:**
    *   `fflate`: DEFLATE 알고리즘 기반의 압축/압축 해제 라이브러리.
    *   `@msgpack/msgpack` (또는 유사 MessagePack 라이브러리): 바이너리 직렬화를 위한 라이브러리.

2.  **내부 구현 함수 (프로젝트에서 찾아야 할 함수):**
    *   `encodeRPack` / `decodeRPack`: RPack 압축 및 해제를 처리하는 커스텀 함수.
    *   `encryptBuffer` / `decryptBuffer`: Web Crypto API (`crypto.subtle`)를 사용하여 AES-GCM 암호화 및 복호화를 수행하는 래퍼 함수. 암호화 키는 **`'risupreset'`** 으로 하드코딩되어 있습니다.
    *   `downloadPreset` / `importPreset`: 실제 익스포트와 임포트 로직의 전체 흐름을 담고 있는 메인 함수.

---

## 구현 단계

### 1. 의존성 설치

새로운 프로젝트에 필요한 라이브러리를 설치합니다.

```bash
npm install fflate @msgpack/msgpack
```

### 2. 핵심 로직 복사

`RisuAI` 소스코드에서 다음 함수들을 찾아 새로운 프로젝트로 복사합니다. 이 함수들은 주로 `src/ts/storage/database.svelte.ts` 및 관련 유틸리티 파일에 위치할 가능성이 높습니다.

*   `encodeRPack()` / `decodeRPack()`
*   `encryptBuffer()` / `decryptBuffer()`
*   `downloadPreset()` / `importPreset()`

### 3. 로직 적용 가이드

복사한 함수들을 새로운 프로젝트 환경에 맞게 수정하고 사용합니다.

#### 익스포트 (Export) 로직 적용

`downloadPreset` 함수의 로직을 참고하여 프리셋 객체를 `.risup` 바이너리 데이터로 변환합니다.

**프로세스 요약:**

1.  **입력 데이터**: 내보낼 JavaScript 객체 (AI 프리셋).
2.  **민감 정보 제거**: 공유되면 안 되는 API 키 등을 객체에서 제거합니다.
3.  **데이터 변환 (체인)**:
    ```javascript
    // const presetObject = { ... }; // 1. 시작 객체

    // 2. 내부 데이터 인코딩
    const msgpackData = encodeMsgpack(presetObject);

    // 3. 암호화
    const encryptedData = await encryptBuffer(msgpackData, 'risupreset');

    // 4. 메타데이터와 함께 컨테이너 생성 및 인코딩
    const container = {
        preset: encryptedData,
        presetVersion: 2, // 버전 명시
        type: 'risupreset'
    };
    const msgpackContainer = encodeMsgpack(container);

    // 5. fflate 압축
    const compressedData = fflate.compressSync(msgpackContainer);

    // 6. RPack 압축
    const finalData = encodeRPack(compressedData); // 최종 Uint8Array 결과물
    ```
4.  **결과물**: `finalData` (`Uint8Array`)를 `.risup` 확장자로 파일에 저장합니다. `RisuAI`의 `downloadFile` 함수는 브라우저 다운로드 로직이므로, 사용 환경에 맞는 파일 저장 로직으로 대체해야 합니다.

#### 파싱 (Import) 로직 적용

`importPreset` 함수의 로직을 참고하여 `.risup` 파일의 바이너리 데이터를 프리셋 객체로 변환합니다.

**프로세스 요약:**

1.  **입력 데이터**: 사용자가 업로드한 `.risup` 파일의 `Uint8Array` 데이터.
2.  **데이터 변환 (역순 체인)**:
    ```javascript
    // const fileData = // ... Uint8Array from .risup file

    // 1. RPack 압축 해제
    const decompressedRPack = decodeRPack(fileData);

    // 2. fflate 압축 해제
    const decompressedFflate = fflate.decompressSync(decompressedRPack);

    // 3. 컨테이너 파싱
    const container = decodeMsgpack(decompressedFflate);

    // 4. 암호화된 데이터 추출 및 복호화
    const encryptedData = container.preset || container.pres;
    const decryptedData = await decryptBuffer(encryptedData, 'risupreset');

    // 5. 최종 데이터 파싱
    const finalObject = decodeMsgpack(decryptedData); // 최종 preset 객체
    ```
3.  **결과물**: `finalObject`는 원본 JavaScript 객체입니다. 이 객체를 프로젝트의 데이터베이스나 상태 관리에 통합합니다. `RisuAI`의 `presetTemplate` 병합 로직은 데이터 무결성을 위한 것이므로, 필요에 따라 유사한 검증 로직을 추가할 수 있습니다.

---

### 4. 추천 스캐폴드 (구조 예시)

아래는 `.risup` 핸들러 로직을 모듈화하기 위한 추천 파일 구조 및 코드 예시입니다.

#### 파일 구조

```
/risup-handler
├── index.ts         # 메인 로직 (익스포트/임포트)
├── crypto.ts        # 암호화/복호화 로직
└── rpack.ts         # RPack 압축/해제 로직
```

#### `rpack.ts`

`RisuAI` 프로젝트에서 `encodeRPack` 및 `decodeRPack` 함수의 소스 코드를 찾아 여기에 붙여넣습니다.

```typescript
// src/ts/storage/rpack.ts 등에서 코드를 찾아 여기에 붙여넣으세요.

export function encodeRPack(data: Uint8Array): Uint8Array {
  // ... RisuAI의 원본 코드
  console.log('encodeRPack is not implemented');
  return data;
}

export function decodeRPack(data: Uint8Array): Uint8Array {
  // ... RisuAI의 원본 코드
  console.log('decodeRPack is not implemented');
  return data;
}
```

#### `crypto.ts`

Web Crypto API를 사용한 암호화/복호화 로직 예시입니다.

```typescript
const textEncoder = new TextEncoder();

async function getKey(secret: string): Promise<CryptoKey> {
  const keyData = textEncoder.encode(secret.padEnd(32, ' '));
  return crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encryptBuffer(data: Uint8Array, secret: string): Promise<Uint8Array> {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  
  const result = new Uint8Array(iv.length + encryptedData.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encryptedData), iv.length);
  return result;
}

export async function decryptBuffer(data: Uint8Array, secret: string): Promise<Uint8Array> {
  const key = await getKey(secret);
  const iv = data.slice(0, 12);
  const encryptedData = data.slice(12);
  
  const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);
  return new Uint8Array(decryptedData);
}
```

#### `index.ts`

모든 로직을 하나로 묶어 간편하게 사용할 수 있는 메인 핸들러입니다.

```typescript
import { compressSync, decompressSync } from 'fflate';
import { encode as encodeMsgpack, decode as decodeMsgpack } from '@msgpack/msgpack';
import { encryptBuffer, decryptBuffer } from './crypto';
import { encodeRPack, decodeRPack } from './rpack';

const SECRET_KEY = 'risupreset';

/**
 * 프리셋 객체를 .risup 바이너리 데이터로 변환합니다.
 * @param presetObject 내보낼 프리셋 객체
 * @returns .risup 파일로 저장될 Uint8Array
 */
export async function exportRisup(presetObject: object): Promise<Uint8Array> {
  // 1. 민감 정보 제거 (필요 시)
  // const cleanPreset = { ...presetObject };
  // delete cleanPreset.apiKey;

  // 2. MessagePack 인코딩
  const msgpackData = encodeMsgpack(presetObject);

  // 3. 암호화
  const encryptedData = await encryptBuffer(msgpackData, SECRET_KEY);

  // 4. 컨테이너 생성 및 인코딩
  const container = {
    preset: encryptedData,
    presetVersion: 2,
    type: 'risupreset',
  };
  const msgpackContainer = encodeMsgpack(container);

  // 5. fflate 압축
  const compressedData = compressSync(msgpackContainer);

  // 6. RPack 압축
  const finalData = encodeRPack(compressedData);

  return finalData;
}

/**
 * .risup 바이너리 데이터를 프리셋 객체로 변환합니다.
 * @param risupData .risup 파일의 Uint8Array 데이터
 * @returns 파싱된 프리셋 객체
 */
export async function importRisup(risupData: Uint8Array): Promise<object> {
  // 1. RPack 압축 해제
  const decompressedRPack = decodeRPack(risupData);

  // 2. fflate 압축 해제
  const decompressedFflate = decompressSync(decompressedRPack);

  // 3. 컨테이너 파싱
  const container = decodeMsgpack(decompressedFflate) as { preset?: Uint8Array, pres?: Uint8Array };

  // 4. 데이터 추출 및 복호화
  const encryptedData = container.preset || container.pres;
  if (!encryptedData) {
    throw new Error('Invalid .risup file: no preset data found.');
  }
  const decryptedData = await decryptBuffer(encryptedData, SECRET_KEY);

  // 5. 최종 데이터 파싱
  const finalObject = decodeMsgpack(decryptedData);

  return finalObject;
}
```

---

## 중요 참고사항

*   **암호화 키**: 암호화/복호화에 사용되는 키는 **`'risupreset'`** 으로 고정되어 있습니다. 이 값이 다르면 호환되지 않습니다.
*   **비동기 처리**: `encryptBuffer`와 `decryptBuffer`는 Web Crypto API를 사용하므로 `async/await` 처리가 필수적입니다.
*   **파일 I/O**: `RisuAI`는 웹 브라우저 환경을 기준으로 구현되어 있습니다. Node.js 등 다른 환경에서 로직을 사용할 경우, 파일 읽기/쓰기 부분을 해당 환경에 맞게 수정해야 합니다.
