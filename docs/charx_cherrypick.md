# `.charx` 파싱/익스포트 로직 체리피킹 가이드

이 문서는 `RisuAI` 프로젝트에서 캐릭터 정보를 패키징하는 `.charx` 파일의 처리 로직을 분리하여 다른 프로젝트에 적용하기 위한 기술 가이드라인을 제공합니다.

`.charx` 파일의 본질은 **ZIP 아카이브**입니다. 따라서 핵심 로직은 ZIP 파일을 열고, 내부의 특정 파일(`card.json`, 에셋 등)을 규칙에 따라 처리하는 것입니다.

---

## 핵심 의존성

체리피킹을 위해 필요한 핵심 라이브러리는 단 하나입니다.

1.  **`fflate`**: 고성능 ZIP 압축 및 압축 해제 라이브러리입니다. `RisuAI`는 스트리밍을 위해 `Unzip` 클래스를 사용하지만, 범용적인 시나리오에서는 더 간결한 `unzip` 및 `zip` 함수를 활용할 수 있습니다.

---

## 구현 단계

### 1. 의존성 설치

새로운 프로젝트에 `fflate` 라이브러리를 설치합니다.

```bash
npm install fflate
```

### 2. 추천 스캐폴드 (구조 예시)

`.charx` 파일을 처리하는 로직을 하나의 모듈로 캡슐화하여 재사용성을 높이는 것을 권장합니다. 파싱과 생성을 모두 포함하는 단일 핸들러 파일을 작성합니다.

#### 파일 구조

```
/charx-handler
└── index.ts         # .charx 파싱 및 생성 로직
```

#### `index.ts`

`fflate`를 사용하여 `.charx` 파일을 비동기적으로 파싱하고 생성하는 로직을 포함합니다.

```typescript
import { unzip, zip, Unzipped, Zippable } from 'fflate';

const textDecoder = new TextDecoder('utf-8');
const textEncoder = new TextEncoder();

/**
 * 파싱된 .charx 파일의 내용물
 */
export interface CharXParseResult {
  /** card.json에서 파싱된 캐릭터 메타데이터 객체 */
  card: any;
  /** module.risum 파일의 원본 바이너리 데이터 */
  module?: Uint8Array;
  /** key: 에셋 파일명, value: 에셋의 원본 바이너리 데이터 */
  assets: Map<string, Uint8Array>;
}

/**
 * .charx 파일을 생성하기 위한 데이터 구조
 */
export interface CharXExportData {
  /** 캐릭터 메타데이터 객체. JSON으로 변환됩니다. */
  card: object;
  /** module.risum 파일의 바이너리 데이터 (선택 사항) */
  module?: Uint8Array;
  /** key: 에셋 파일명, value: 에셋의 바이너리 데이터 */
  assets: Map<string, Uint8Array>;
}

/**
 * .charx 파일의 바이너리 데이터를 받아 내용을 파싱합니다.
 * 이 함수는 에셋을 저장하지 않고, 원본 데이터를 그대로 반환하여 재사용성을 높입니다.
 * @param charxData .charx 파일의 Uint8Array 데이터
 * @returns 파싱된 캐릭터 데이터, 모듈, 에셋 맵
 */
export function importCharX(charxData: Uint8Array): Promise<CharXParseResult> {
  return new Promise((resolve, reject) => {
    unzip(charxData, (err, unzipped) => {
      if (err) {
        return reject(err);
      }

      if (!unzipped['card.json']) {
        return reject(new Error('Invalid .charx file: card.json not found.'));
      }

      const card = JSON.parse(textDecoder.decode(unzipped['card.json']));
      const assets = new Map<string, Uint8Array>();
      let module: Uint8Array | undefined;

      for (const filename in unzipped) {
        if (filename === 'card.json') continue;
        if (filename === 'module.risum') {
          module = unzipped[filename];
        } else {
          assets.set(filename, unzipped[filename]);
        }
      }

      resolve({ card, module, assets });
    });
  });
}

/**
 * 캐릭터 데이터와 에셋을 .charx (ZIP) 파일로 패키징합니다.
 * @param exportData 캐릭터 카드, 모듈, 에셋 데이터
 * @returns 생성된 .charx 파일의 바이너리 데이터 (Uint8Array)
 */
export function exportCharX(exportData: CharXExportData): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const zippable: Zippable = {};

    // 1. card.json 추가
    zippable['card.json'] = textEncoder.encode(JSON.stringify(exportData.card, null, 2));

    // 2. 모듈 추가 (존재하는 경우)
    if (exportData.module) {
      zippable['module.risum'] = exportData.module;
    }

    // 3. 에셋 추가
    for (const [filename, data] of exportData.assets.entries()) {
      zippable[filename] = data;
    }

    zip(zippable, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}
```

---

## 사용 예시 및 중요 참고사항

이 스캐폴드는 `.charx` 파일의 내용물을 분리하여 반환할 뿐, `RisuAI`의 원본 코드처럼 에셋을 자동으로 저장하고 경로를 교체하지는 않습니다. 이러한 후처리 과정은 모듈의 재사용성을 위해 사용하는 쪽의 책임으로 분리되었습니다.

### 임포트(Import) 후처리 예시

```typescript
import { importCharX } from './charx-handler';

async function processCharacterFile(charxData: Uint8Array) {
  // 1. .charx 파일 파싱
  const { card, assets } = await importCharX(charxData);

  // 2. 에셋 저장 및 경로 매핑 (애플리케이션의 책임)
  //    - 이 예시에서는 `saveAssetToDB`가 에셋을 저장하고 고유 URI를 반환한다고 가정합니다.
  const assetPathMap = new Map<string, string>();
  for (const [filename, data] of assets.entries()) {
    const newUri = await saveAssetToDB(filename, data);
    assetPathMap.set(filename, newUri);
  }

  // 3. 캐릭터 데이터 내의 에셋 경로 교체 (애플리케이션의 책임)
  //    - card.image, card.expressions 등의 경로를 실제 저장된 URI로 변경합니다.
  let cardJsonString = JSON.stringify(card);
  for (const [originalName, newUri] of assetPathMap.entries()) {
    // 정규식을 사용하거나, 단순 문자열 치환을 사용할 수 있습니다.
    // 원본 파일명이 '/'를 포함할 수 있으므로 주의해야 합니다.
    cardJsonString = cardJsonString.replace(new RegExp(escapeRegExp(originalName), 'g',), newUri);
  }
  const finalCardObject = JSON.parse(cardJsonString);

  // 4. 완성된 캐릭터 객체를 DB에 저장
  // await saveCharacterToDB(finalCardObject);

  console.log('Character processing complete!', finalCardObject);
}

// 사용자 정의 함수 예시
declare function saveAssetToDB(filename: string, data: Uint8Array): Promise<string>;
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[.]]/g, '\$&');
}
```

### 익스포트(Export) 예시

```typescript
import { exportCharX } from './charx-handler';

async function createCharacterPackage(character: any, assets: Map<string, Uint8Array>) {
  // character 객체 내부의 에셋 경로를 다시 원본 파일명으로 되돌리는 전처리 과정이 필요할 수 있습니다.

  const charxData = await exportCharX({
    card: character,
    assets: assets,
  });

  // charxData (Uint8Array)를 파일로 저장하거나 서버로 전송합니다.
  // saveFile(charxData, `${character.name}.charx`);
}
```
