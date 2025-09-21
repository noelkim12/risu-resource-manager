import { unzip, zip } from 'fflate';
import type { Unzipped, Zippable } from 'fflate';

const textDecoder = new TextDecoder('utf-8');
const textEncoder = new TextEncoder();

/**
 * 파싱된 .charx 파일의 내용물
 */
export interface CharXParseResult {
  /** card.json에서 파싱된 캐릭터 메타데이터 객체 */
  card: object;
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
