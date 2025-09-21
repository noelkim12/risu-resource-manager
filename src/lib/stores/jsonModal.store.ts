import { writable } from "svelte/store";

interface JsonModalState {
  isOpen: boolean;
  title: string;
  jsonData: any;
}

const initialState: JsonModalState = {
  isOpen: false,
  title: "",
  jsonData: null,
};

// JSON 모달 상태 store
export const jsonModalState = writable<JsonModalState>(initialState);

// JSON 모달 관리 함수들
export const jsonModalStore = {
  /**
   * JSON 모달을 열고 데이터를 표시합니다
   * @param title 모달 제목
   * @param jsonData 표시할 JSON 데이터
   */
  open: (title: string, jsonData: any) => {
    jsonModalState.set({
      isOpen: true,
      title,
      jsonData,
    });
  },

  /**
   * JSON 모달을 닫습니다
   */
  close: () => {
    jsonModalState.set(initialState);
  },

  /**
   * 현재 모달 상태를 반환합니다
   */
  getState: () => {
    let currentState: JsonModalState;
    jsonModalState.subscribe(state => {
      currentState = state;
    })();
    return currentState!;
  },
};