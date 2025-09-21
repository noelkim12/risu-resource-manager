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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @function checkNullish
 * @description 데이터가 undefined 또는 null인지 확인합니다.
 * @param data
 * @returns
 */
export function checkNullish(data: any) {
  return data === undefined || data === null;
}

// 중첩된 객체 속성에 안전하게 접근하는 함수
export function getNestedValue(obj: any, path: string | null): any {
  if (!obj || !path) return undefined;

  // 일반적인 속성 접근
  if (path in obj) {
    return obj[path];
  }

  // 점으로 구분된 경로 처리 (예: "reverseProxyOobaArgs.mode")
  if (path.includes(".")) {
    const [prefix, ...rest] = path.split(".");
    const remainingPath = rest.join(".");

    // ooba 설정들은 reverseProxyOobaArgs에 있음
    if (prefix === "ooba" && obj.reverseProxyOobaArgs) {
      return getNestedValue(obj.reverseProxyOobaArgs, remainingPath);
    }

    // NAI 설정들은 NAIsettings에 있음
    if (prefix === "NAIsettings" && obj.NAIsettings) {
      return getNestedValue(obj.NAIsettings, remainingPath);
    }

    // ainconfig 설정들은 ainconfig에 있음
    if (prefix === "ainconfig" && obj.ainconfig) {
      return getNestedValue(obj.ainconfig, remainingPath);
    }

    // 기타 중첩 객체 접근
    if (prefix in obj) {
      return getNestedValue(obj[prefix], remainingPath);
    }
  }

  return undefined;
}

// 중첩된 객체 속성에 값을 설정하는 함수
export function setNestedValue(obj: any, path: string | null, value: any): void {
  if (!obj || !path) return;

  // 일반적인 속성 설정
  if (!path.includes(".")) {
    obj[path] = value;
    return;
  }

  // 점으로 구분된 경로 처리 (예: "reverseProxyOobaArgs.mode")
  const [prefix, ...rest] = path.split(".");
  const remainingPath = rest.join(".");

  // ooba 설정들은 reverseProxyOobaArgs에 설정
  if (prefix === "ooba") {
    if (!obj.reverseProxyOobaArgs) {
      obj.reverseProxyOobaArgs = {};
    }
    setNestedValue(obj.reverseProxyOobaArgs, remainingPath, value);
    return;
  }

  // NAI 설정들은 NAIsettings에 설정
  if (prefix === "NAIsettings") {
    if (!obj.NAIsettings) {
      obj.NAIsettings = {};
    }
    setNestedValue(obj.NAIsettings, remainingPath, value);
    return;
  }

  // ainconfig 설정들은 ainconfig에 설정
  if (prefix === "ainconfig") {
    if (!obj.ainconfig) {
      obj.ainconfig = {};
    }
    setNestedValue(obj.ainconfig, remainingPath, value);
    return;
  }

  // 기타 중첩 객체 설정
  if (!obj[prefix]) {
    obj[prefix] = {};
  }
  setNestedValue(obj[prefix], remainingPath, value);
}
