<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { language } from "$lib/i18n";
  import ModelList from "../../../../ui/risup/ModelList.svelte";
  import Help from "../../../../ui/common/others/Help.svelte";
  import { getModelInfo } from "../../../../../lib/utils/modelList";
  import { risupStore, currentRisupContent } from "../../../../../lib/stores/risup.store";
  import ViewerButton from "../../../../ui/common/ViewerButton.svelte";
  import SliderInput from "../../../../ui/common/forms/SliderInput.svelte";
  import type { BotPreset } from "../../../../../types/risu/preset.types";
  import { LLMFormat } from "../../../../../types/risu/llm/model.types";
  import Accordion from "../../../../ui/common/Accordion.svelte";
  import ChatFormatSettings from "../chat/ChatFormatSettings.svelte";
  import SelectInput from "../../../../ui/common/forms/SelectInput.svelte";
  import OptionInput from "../../../../ui/common/forms/OptionInput.svelte";
  import OptionalInput from "../../../../ui/common/forms/OptionalInput.svelte";

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
  $: keys = currentContent ? Object.keys(currentContent) : [];
  $: dynamicModelInfo = getModelInfo(currentContent?.aiModel || "");

  $: DBState = { db: currentContent };

  function changeValue(key: string, value: any) {}
</script>
