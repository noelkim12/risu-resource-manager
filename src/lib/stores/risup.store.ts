import { writable, derived } from "svelte/store";
import type { BotPreset } from "../../types/risu/preset.types";
import { risuStorage } from "../storage";

// 중첩된 키 경로 처리를 위한 헬퍼 함수들
function parseKeyPath(key: string): string {
  // ooba.* → reverseProxyOobaArgs.*로 매핑
  if (key.startsWith("ooba.")) {
    return key.replace("ooba.", "reverseProxyOobaArgs.");
  }

  // NAIsettings.*, ainconfig.*는 그대로 유지
  return key;
}

function setNestedValue(obj: any, path: string, value: any): void {
  if (!obj || !path) return;

  // 단순 키 처리
  if (!path.includes(".")) {
    obj[path] = value;
    return;
  }

  // 점으로 구분된 경로 처리
  const keys = path.split(".");
  let current = obj;

  // 마지막 키를 제외한 모든 경로를 탐색하며 객체 생성
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  // 마지막 키에 값 설정
  current[keys[keys.length - 1]] = value;
}

// 현재 선택된 risup 파일 ID
export const selectedRisupFileId = writable<string | null>(null);

// 모든 risup 파일들의 parsedContent 저장
export const risupContents = writable<Record<string, BotPreset>>({});

// 현재 선택된 risup 파일의 내용
export const currentRisupContent = derived(
  [selectedRisupFileId, risupContents],
  ([$selectedRisupFileId, $risupContents]) => {
    if (!$selectedRisupFileId) return null;
    return $risupContents[$selectedRisupFileId] || null;
  }
);

// Risup store 관리 함수들
export const risupStore = {
  // 파일 선택
  selectFile: (fileId: string | null) => {
    selectedRisupFileId.set(fileId);
  },

  // 파일 내용 설정 (저장소 동기화 포함)
  setContent: async (fileId: string, content: BotPreset) => {
    risupContents.update((contents) => ({
      ...contents,
      [fileId]: content,
    }));

    // 저장소에도 저장
    try {
      await risuStorage.saveParsedContent(fileId, content);
    } catch (error) {
      console.warn("Failed to save risup content to storage:", error);
    }
  },

  // 저장소에서 파일 내용 로드
  loadContent: async (fileId: string): Promise<BotPreset | null> => {
    try {
      const content = await risuStorage.getParsedContent(fileId);
      if (content) {
        risupContents.update((contents) => ({
          ...contents,
          [fileId]: content,
        }));
        return content;
      }
      return null;
    } catch (error) {
      console.warn("Failed to load risup content from storage:", error);
      return null;
    }
  },

  // 모든 저장된 risup 파일 로드
  loadAllContents: async (): Promise<void> => {
    try {
      const allFiles = await risuStorage.getAllFiles();
      const risupFiles = allFiles.filter(file => file.type === 'risup');

      const loadedContents: Record<string, BotPreset> = {};

      for (const file of risupFiles) {
        try {
          const content = await risuStorage.getParsedContent(file.id);
          if (content) {
            loadedContents[file.id] = content;
          }
        } catch (error) {
          console.warn(`Failed to load content for file ${file.id}:`, error);
        }
      }

      risupContents.set(loadedContents);
    } catch (error) {
      console.warn("Failed to load all risup contents:", error);
    }
  },

  // 특정 키 값 업데이트 (중첩 키 지원)
  updateKey: async (fileId: string, key: string, value: any) => {
    risupContents.update((contents) => {
      if (!contents[fileId]) return contents;

      // 기존 content를 깊은 복사
      const updatedContent = JSON.parse(JSON.stringify(contents[fileId]));

      // 키 경로 파싱 및 중첩 값 설정
      const parsedPath = parseKeyPath(key);
      setNestedValue(updatedContent, parsedPath, value);

      const updated = {
        ...contents,
        [fileId]: updatedContent,
      };

      // 저장소에 변경사항 저장
      risuStorage.saveParsedContent(fileId, updated[fileId]).catch((error) => {
        console.warn("Failed to save updated risup content to storage:", error);
      });

      return updated;
    });
  },

  // 전체 컨텐츠 업데이트 (setContent의 별칭)
  updateContent: async (fileId: string, content: BotPreset) => {
    risupContents.update((contents) => ({
      ...contents,
      [fileId]: content,
    }));

    // 저장소에도 저장
    try {
      await risuStorage.saveParsedContent(fileId, content);
    } catch (error) {
      console.warn("Failed to save risup content to storage:", error);
    }
  },

  // 파일 제거
  removeFile: (fileId: string) => {
    risupContents.update((contents) => {
      const { [fileId]: removed, ...rest } = contents;
      return rest;
    });

    // 현재 선택된 파일이 제거된 파일이면 선택 해제
    selectedRisupFileId.update((currentId) => (currentId === fileId ? null : currentId));
  },

  // 모든 파일 초기화
  clear: () => {
    risupContents.set({});
    selectedRisupFileId.set(null);
  },
};
