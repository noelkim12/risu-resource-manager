import { encodeRPack, decodeRPack } from '../rpack/rpack_bg';
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
  module: object;
  assets: RisumAsset[];
}

/**
 * 모듈 메타데이터와 에셋 데이터를 .risum 바이너리 파일로 패키징합니다.
 * @param moduleData 모듈의 메타데이터 (JSON으로 변환 가능한 객체)
 * @param assets 포함할 에셋 데이터 배열
 * @returns .risum 파일의 바이너리 데이터 (Uint8Array)
 */
export async function exportRisum(moduleData: object, assets: RisumAsset[]): Promise<Uint8Array> {
  const writer = new BinaryWriter();

  // 1. 메인 데이터 준비 (JSON -> RPack 압축)
  const mainDataJson = textEncoder.encode(JSON.stringify({ module: moduleData, type: 'risuModule' }));
  const compressedMainData = await encodeRPack(mainDataJson);

  // 2. 헤더 작성
  writer.writeByte(MAGIC_NUMBER);
  writer.writeByte(VERSION);
  writer.writeUInt32LE(compressedMainData.length);
  writer.writeBytes(compressedMainData);

  // 3. 에셋 블록 작성
  for (const asset of assets) {
    const compressedAssetData = await encodeRPack(asset.data);
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
export async function importRisum(risumFileContent: Uint8Array): Promise<RisumImportResult> {
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
  const mainDataJson = await decodeRPack(compressedMainData);
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
    const assetData = await decodeRPack(compressedAssetData);
    
    // 참고: 원본 RisuAI와 달리, 여기서는 에셋을 바로 저장하지 않고 반환합니다.
    // 에셋 ID는 모듈 데이터 내부의 경로 등을 참고하여 설정해야 합니다.
    assets.push({ id: `asset_${assets.length}`, data: assetData });
  }

  return {
    module: mainData.module,
    assets: assets,
  };
}