import { compressSync, decompressSync } from "fflate";
import { encode as encodeMsgpack, decode as decodeMsgpack } from "msgpackr";
import { Buffer } from "buffer";
import { encryptBuffer, decryptBuffer } from "./crypto";
import { encodeRPack, decodeRPack } from "../rpack/rpack_bg";
import type { RisupFile } from "../../types/risu/preset.types";
import { risupTemplate } from "$lib/templates/risupTemplate";
import { readFileAsUint8Array } from "$lib/utils/util";

const SECRET_KEY = "risupreset";

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
		type: "risupreset",
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
	try {
		console.log("1. Starting RPack decompression...");
		// 1. RPack 압축 해제
		const decompressedRPack = await decodeRPack(risupData);
		console.log("1. RPack decompression completed, size:", decompressedRPack.length);

		console.log("2. Starting fflate decompression...");
		// 2. fflate 압축 해제
		const decompressedFflate = decompressSync(decompressedRPack);
		console.log("2. fflate decompression completed, size:", decompressedFflate.length);

		console.log("3. Parsing container...");
		// 3. 컨테이너 파싱
		const decoded = decodeMsgpack(decompressedFflate) as RisupFile;
		console.log("3. Container parsed:", Object.keys(decoded));

		let pre: any;
		if ((decoded.presetVersion === 0 || decoded.presetVersion === 2) && decoded.type === "preset") {
			pre = {
				type: 'risup',
				...risupTemplate,
				...decodeMsgpack(
					Buffer.from(await decryptBuffer(decoded.preset ?? decoded.pres, "risupreset"))
				),
			};
		}

		console.log("4. Extracting and decrypting data...");

		return pre;
	} catch (error) {
		console.log(error.message);
		console.log(error.stack);
		console.log(error.name);

		console.error("importRisup error at step:", error);
		throw error;
	}
}

export async function importRisupFile(risupFile: File): Promise<object> {
	const risupData = await readFileAsUint8Array(risupFile);
	return await importRisup(risupData);
}
