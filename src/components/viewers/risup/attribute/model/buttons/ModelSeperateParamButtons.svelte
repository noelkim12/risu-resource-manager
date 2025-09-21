<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { currentRisupContent, risupStore } from "../../../../../../lib/stores/risup.store";
  import type { BotPreset } from "../../../../../../types/risu/preset.types";
  import { getModelInfo } from "../../../../../../lib/utils/modelList";

  /**
   * ModelSeperateParamButtons 컴포넌트
   *
   * @example
   * <ModelSeperateParamButtons
   *   fileId="file123"
   * />
   */
  const dispatch = createEventDispatcher();

  // 컴포넌트 마운트 시 저장된 모든 risup 파일 로드
  onMount(() => {
    risupStore.loadAllContents();
  });

  export let fileId = "";

  // fileId가 변경될 때 store에 content 설정 및 저장소에서 로드
  $: if (fileId) {
    // 먼저 저장소에서 기존 내용 로드 시도
    risupStore.loadContent(fileId).then((loadedContent) => {});

    risupStore.selectFile(fileId);
  }

  // store에서 현재 content 가져오기 (store 우선, props는 백업)
  $: storeContent = $currentRisupContent;
  $: currentContent = (storeContent as BotPreset) || ({} as BotPreset);

  function changeValue(key: string, value: any) {}
</script>
