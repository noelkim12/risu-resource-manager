import { writable, derived } from 'svelte/store';

// 현재 선택된 파일 ID (모든 타입 공통)
export const selectedFileId = writable<string | null>(null);

// 현재 선택된 파일 타입 (risup, risum, charx)
export const selectedFileType = writable<'risup' | 'risum' | 'charx' | null>(null);

// 현재 선택된 필드 키 (aiModel, subModel 등)
export const selectedFieldKey = writable<string | null>(null);

// 선택 상태 관리 함수들
export const selectionStore = {
  // 파일 선택 (타입과 함께)
  selectFile: (fileId: string | null, fileType: 'risup' | 'risum' | 'charx' | null = null) => {
    selectedFileId.set(fileId);
    selectedFileType.set(fileType);
  },

  // 필드 선택
  selectField: (fieldKey: string | null) => {
    selectedFieldKey.set(fieldKey);
  },

  // 모든 선택 해제
  clearSelection: () => {
    selectedFileId.set(null);
    selectedFileType.set(null);
    selectedFieldKey.set(null);
  },

  // 필드만 해제
  clearField: () => {
    selectedFieldKey.set(null);
  }
};

// 현재 선택 상태 정보를 하나의 객체로 제공
export const currentSelection = derived(
  [selectedFileId, selectedFileType, selectedFieldKey],
  ([$selectedFileId, $selectedFileType, $selectedFieldKey]) => ({
    fileId: $selectedFileId,
    fileType: $selectedFileType,
    fieldKey: $selectedFieldKey,
    hasFile: !!$selectedFileId,
    hasField: !!$selectedFieldKey,
    isComplete: !!$selectedFileId && !!$selectedFileType && !!$selectedFieldKey
  })
);