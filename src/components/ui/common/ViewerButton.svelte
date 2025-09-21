<script lang="ts">
  import { ChevronRight } from "lucide-svelte";
  import { language } from "../../../lib/i18n";
  import { selectionStore } from "../../../lib/stores/selection.store";
  import { risupStore, currentRisupContent } from "../../../lib/stores/risup.store";

  /**
   * ViewerButton 컴포넌트
   * @example
   * <ViewerButton
   *   key="aiModel"
   *   value="gpt-4"
   *   fileId="file123"
   *   fileType="risup"
   * />
   */
  export let key: string = "";
  export let value: any = null;
  export let fileId: string = "";
  export let fileType: "risup" | "risum" | "charx" = "risup";

  function handleKeyClick() {
    // selection store에 선택 상태 설정
    selectionStore.selectFile(fileId, fileType);
    selectionStore.selectField(key);
  }

  function contentDescriptor(value: any): string {
    // null/undefined 처리
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    // 객체 처리
    if (typeof value === "object") {
      const keyCount = Object.keys(value).length;
      return `객체 (${keyCount}개 속성)`;
    }

    // 문자열 처리
    if (typeof value === "string") {
      const maxLength = 50;
      return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
    }
    if (typeof value === "number") {
      if (value === -1000) {
        return "비활성화됨";
      }
      return value.toLocaleString();
    }
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    if (typeof value === "function") {
      return "함수";
    }
    if (typeof value === "symbol") {
      return "심볼";
    }

    // 기타 타입
    return String(value);
  }
</script>

<button type="button" class="key-button" on:click={handleKeyClick}>
  <div class="key-button-content">
    <div class="key-button-info">
      <div class="key-button-title">{language[key]}({key})</div>
      <div class="key-button-description">
        {contentDescriptor(value)}
      </div>
    </div>
    <ChevronRight class="key-button-icon" />
  </div>
</button>
