import { readFile } from "@tauri-apps/plugin-fs";
import { basename } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";

export function readFileAsUint8Array(file) {
	return new Promise<Uint8Array>((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			const buffer = event.target.result;
			const uint8Array = new Uint8Array(buffer as ArrayBuffer);
			resolve(uint8Array);
		};

		reader.onerror = (error) => {
			reject(error);
		};

		reader.readAsArrayBuffer(file);
	});
}

const domSelect = true;

/**
 * @function selectSingleFile
 * @description 
 * @param extensions 
 * @returns 
 */
export async function selectSingleFile(extensions: string[]) {
	if (domSelect) {
		const v = await selectFileByDom(extensions, "single");
		const file = v[0];
		return { name: file.name, data: await readFileAsUint8Array(file) };
	}

	const selected = await open({
		filters: [
			{
				name: extensions.join(", "),
				extensions: extensions,
			},
		],
	});
	if (Array.isArray(selected)) {
		return null;
	} else if (selected === null) {
		return null;
	} else {
		return { name: await basename(selected), data: await readFile(selected) };
	}
}

/**
 * @function selectFileByDom 
 * @description 브라우저에서 파일 선택 다이얼로그를 엽니다.
 * @param allowedExtensions 
 * @param multiple 
 * @returns 
 */
export function selectFileByDom(
	allowedExtensions: string[],
	multiple: "multiple" | "single" = "single"
) {
	return new Promise<null | File[]>((resolve) => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.multiple = multiple === "multiple";
		const acceptAll = allowedExtensions[0] === "*";
		if (!acceptAll) {
			if (allowedExtensions?.length) {
				fileInput.accept = allowedExtensions.map((ext) => `.${ext}`).join(",");
			}
		} else {
			fileInput.accept = "*";
		}

		fileInput.addEventListener("change", (event) => {
			if (fileInput.files.length === 0) {
				resolve([]);
				return;
			}

			const files = acceptAll
				? Array.from(fileInput.files)
				: Array.from(fileInput.files).filter((file) => {
						const fileExtension = file.name.split(".").pop().toLowerCase();
						return !allowedExtensions || allowedExtensions.includes(fileExtension);
					});

			fileInput.remove();
			resolve(files);
		});

		document.body.appendChild(fileInput);
		fileInput.click();
		fileInput.style.display = "none"; // Hide the file input element
	});
}

/**
 * Uint8Array를 Buffer로 변환합니다.
 * @param data Uint8Array 데이터
 * @returns Buffer 객체
 */
export function uint8ArrayToBuffer(data: Uint8Array): Buffer {
	return Buffer.from(data);
}

/**
 * @function sleep
 * @description 지정된 시간(milliseconds)동안 대기합니다.
 * @param ms 
 * @returns 
 */
export function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

/**
 * @function checkNullish
 * @description 데이터가 undefined 또는 null인지 확인합니다.
 * @param data 
 * @returns 
 */
export function checkNullish(data:any){
    return data === undefined || data === null
}