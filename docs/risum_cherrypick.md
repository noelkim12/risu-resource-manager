# `.risum` 파싱/익스포트 로직 체리피킹 가이드

이 문서는 `RisuAI` 프로젝트에서 모듈과 에셋을 패키징하는 `.risum` 파일의 처리 로직을 분리하여 다른 프로젝트에 적용하기 위한 기술 가이드라인을 제공합니다.

`.risum`은 여러 데이터 조각(메타데이터 JSON, 이미지 바이너리 등)을 정해진 순서에 따라 하나의 바이너리 파일로 합친 커스텀 포맷입니다.

---

## 핵심 의존성 및 개념

체리피킹을 위해 다음 요소들에 대한 이해와 준비가 필요합니다.

1.  **`RPack` 압축**:
    *   `.risum` 파일의 각 데이터 블록(메인 데이터, 에셋 데이터)은 `RPack`이라는 커스텀 압축 알고리즘을 통해 압축됩니다. 따라서 `encodeRPack` 및 `decodeRPack` 함수의 원본 코드를 반드시 확보해야 합니다.

2.  **바이너리 데이터 처리**:
    *   파일을 생성하고 파싱하는 과정은 바이트(byte) 단위의 직접적인 조작을 필요로 합니다. JavaScript에서 이를 위해 `Uint8Array`와 `DataView` 객체를 주로 사용하게 됩니다.

---

## 구현 단계

### 1. 핵심 로직 복사

`RisuAI` 소스코드에서 다음 함수들을 찾아 새로운 프로젝트로 복사합니다.

*   `encodeRPack()` / `decodeRPack()`: `.risum` 포맷의 핵심 압축 로직입니다. (필수)
*   `exportModule()` / `readModule()`: `src/ts/process/modules.ts`에 위치한 원본 구현체로, 전체 흐름을 이해하기 위한 참고 자료로 활용합니다.

### 2. 추천 스캐폴드 (구조 예시)

`.risum` 핸들러를 재사용 가능한 모듈로 만들기 위한 추천 파일 구조 및 코드 예시입니다. 이 구조는 바이너리 생성을 도와주는 헬퍼 클래스를 도입하여 복잡도를 낮춥니다.

#### 파일 구조

```
/risum-handler
├── index.ts         # 메인 로직 (exportRisum / importRisum)
├── rpack.ts         # RPack 압축/해제 로직 (가져와야 함)
└── binary-helper.ts # 바이너리 데이터 순차 처리를 위한 헬퍼
```

#### `rpack.ts`

`RisuAI` 프로젝트에서 `encodeRPack` 및 `decodeRPack` 함수의 소스 코드를 찾아 여기에 붙여넣습니다.

```typescript
// RisuAI 프로젝트의 원본 RPack 구현 코드를 여기에 붙여넣으세요.

export function encodeRPack(data: Uint8Array): Uint8Array {
  // ... 원본 코드 ...
  console.warn('encodeRPack is not implemented.');
  return data;
}

export function decodeRPack(data: Uint8Array): Uint8Array {
  // ... 원본 코드 ...
  console.warn('decodeRPack is not implemented.');
  return data;
}
```

#### `binary-helper.ts`

바이너리 파일을 순차적으로 생성하고 읽기 위한 헬퍼입니다.

```typescript
// 바이너리 파일 생성을 돕는 클래스
export class BinaryWriter {
  private parts: Uint8Array[] = [];
  private totalLength = 0;

  public writeByte(value: number): void {
    const arr = new Uint8Array([value]);
    this.parts.push(arr);
    this.totalLength += arr.length;
  }

  public writeUInt32LE(value: number): void {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, value, true); // true for little-endian
    const arr = new Uint8Array(buffer);
    this.parts.push(arr);
    this.totalLength += arr.length;
  }

  public writeBytes(data: Uint8Array): void {
    this.parts.push(data);
    this.totalLength += data.length;
  }

  public toUint8Array(): Uint8Array {
    const result = new Uint8Array(this.totalLength);
    let offset = 0;
    for (const part of this.parts) {
      result.set(part, offset);
      offset += part.length;
    }
    return result;
  }
}

// 바이너리 파일 파싱을 돕는 클래스
export class BinaryReader {
  private view: DataView;
  private offset = 0;

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
  }

  public readByte(): number {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  public readUInt32LE(): number {
    const value = this.view.getUint32(this.offset, true); // true for little-endian
    this.offset += 4;
    return value;
  }

  public readBytes(length: number): Uint8Array {
    const value = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length);
    this.offset += length;
    return value;
  }
  
  public eof(): boolean {
    return this.offset >= this.view.byteLength;
  }
}
```

#### `index.ts`

모든 로직을 하나로 묶어 `.risum` 파일을 생성하고 파싱하는 메인 핸들러입니다.

```typescript
import { encodeRPack, decodeRPack } from './rpack';
import { BinaryWriter, BinaryReader } from './binary-helper';

const MAGIC_NUMBER = 111;
const VERSION = 0;
const ASSET_MARKER = 1;
const EOF_MARKER = 0;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export interface RisumAsset {
  // 에셋을 식별할 수 있는 고유 ID 또는 파일명
  id: string; 
  // 에셋의 원본 바이너리 데이터
  data: Uint8Array;
}

export interface RisumImportResult {
  module: any;
  assets: RisumAsset[];
}

/**
 * 모듈 메타데이터와 에셋 데이터를 .risum 바이너리 파일로 패키징합니다.
 * @param moduleData 모듈의 메타데이터 (JSON으로 변환 가능한 객체)
 * @param assets 포함할 에셋 데이터 배열
 * @returns .risum 파일의 바이너리 데이터 (Uint8Array)
 */
export function exportRisum(moduleData: object, assets: RisumAsset[]): Uint8Array {
  const writer = new BinaryWriter();

  // 1. 메인 데이터 준비 (JSON -> RPack 압축)
  const mainDataJson = textEncoder.encode(JSON.stringify({ module: moduleData, type: 'risuModule' }));
  const compressedMainData = encodeRPack(mainDataJson);

  // 2. 헤더 작성
  writer.writeByte(MAGIC_NUMBER);
  writer.writeByte(VERSION);
  writer.writeUInt32LE(compressedMainData.length);
  writer.writeBytes(compressedMainData);

  // 3. 에셋 블록 작성
  for (const asset of assets) {
    const compressedAssetData = encodeRPack(asset.data);
    writer.writeByte(ASSET_MARKER);
    writer.writeUInt32LE(compressedAssetData.length);
    writer.writeBytes(compressedAssetData);
  }

  // 4. 파일 끝 마커 작성
  writer.writeByte(EOF_MARKER);

  return writer.toUint8Array();
}

/**
 * .risum 바이너리 데이터를 파싱하여 모듈 메타데이터와 에셋 데이터를 추출합니다.
 * @param risumFileContent .risum 파일의 전체 바이너리 데이터
 * @returns 파싱된 모듈과 에셋 데이터
 */
export function importRisum(risumFileContent: Uint8Array): RisumImportResult {
  const reader = new BinaryReader(risumFileContent.buffer);

  // 1. 헤더 유효성 검사
  const magic = reader.readByte();
  const version = reader.readByte();
  if (magic !== MAGIC_NUMBER || version !== VERSION) {
    throw new Error('Invalid .risum file format.');
  }

  // 2. 메인 데이터 파싱
  const mainDataLength = reader.readUInt32LE();
  const compressedMainData = reader.readBytes(mainDataLength);
  const mainDataJson = decodeRPack(compressedMainData);
  const mainData = JSON.parse(textDecoder.decode(mainDataJson));

  const assets: RisumAsset[] = [];

  // 3. 에셋 블록 파싱
  while (!reader.eof()) {
    const marker = reader.readByte();
    if (marker === EOF_MARKER) {
      break; // 파일 끝
    }
    if (marker !== ASSET_MARKER) {
      throw new Error('Invalid asset marker found in .risum file.');
    }

    const assetLength = reader.readUInt32LE();
    const compressedAssetData = reader.readBytes(assetLength);
    const assetData = decodeRPack(compressedAssetData);
    
    // 참고: 원본 RisuAI와 달리, 여기서는 에셋을 바로 저장하지 않고 반환합니다.
    // 에셋 ID는 모듈 데이터 내부의 경로 등을 참고하여 설정해야 합니다.
    assets.push({ id: `asset_${assets.length}`, data: assetData });
  }

  return {
    module: mainData.module,
    assets: assets,
  };
}
```

---

## 중요 참고사항

*   **RPack 의존성**: 이 모든 로직은 `RisuAI`의 `encodeRPack`/`decodeRPack` 구현과 100% 동일하다는 전제 하에 동작합니다. 이 함수들을 정확히 가져오는 것이 가장 중요합니다.
*   **에셋 관리**: 제시된 `importRisum` 스캐폴드는 원본과 달리 에셋의 바이너리 데이터를 그대로 반환합니다. 반환된 에셋 데이터를 파일로 저장하고, `module` 데이터 내부의 경로 정보와 연결하는 처리는 이 함수를 호출하는 애플리케이션의 책임입니다. 이는 로직의 재사용성을 높이기 위함입니다.
*   **에러 처리**: 예시 코드에는 기본적인 에러 처리만 포함되어 있습니다. 실제 프로덕션 환경에서는 더 견고한 예외 처리를 추가해야 합니다.
