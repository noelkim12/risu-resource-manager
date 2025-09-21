<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { getModelInfo } from "../../../../../../lib/utils/modelList";
  import { risupStore, currentRisupContent } from "../../../../../../lib/stores/risup.store";
  import type { BotPreset } from "../../../../../../types/risu/preset.types";
  import ViewerButton from "../../../../../ui/common/ViewerButton.svelte";

  /**
   * ModelConditionalAttrButtons 컴포넌트
   *
   * @example
   * <ModelConditionalAttrButtons
   *   fileId="file123"
   * />
   */
  const dispatch = createEventDispatcher();

  export let fileId = "";

  // 컴포넌트 마운트 시 저장된 모든 risup 파일 로드
  onMount(() => {
    risupStore.loadAllContents();
  });

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
  $: dynamicModelInfo = getModelInfo(currentContent.aiModel || "");

  $: DBState = { db: currentContent };

  function changeValue(key: string, value: any) {}
</script>

{#if currentContent?.aiModel?.startsWith("gpt") || currentContent?.aiModel === "reverse_proxy" || currentContent?.aiModel === "openrouter"}
  <ViewerButton
    key="generationSeed"
    value={currentContent.generationSeed}
    {fileId}
    fileType="risup"
  />
{/if}
{#if dynamicModelInfo.parameters.includes("thinking_tokens")}
  <ViewerButton
    key="thinkingTokens"
    value={currentContent.thinkingTokens}
    {fileId}
    fileType="risup"
  />
{/if}
<ViewerButton key="temperature" value={currentContent.temperature} {fileId} fileType="risup" />
{#if dynamicModelInfo.parameters.includes("top_k")}
  <ViewerButton key="top_k" value={currentContent.top_k} {fileId} fileType="risup" />
{/if}
{#if dynamicModelInfo.parameters.includes("top_p")}
  <ViewerButton key="top_p" value={currentContent.top_p} {fileId} fileType="risup" />
{/if}
{#if dynamicModelInfo.parameters.includes("top_a")}
  <ViewerButton key="top_a" value={currentContent.top_a} {fileId} fileType="risup" />
{/if}
<!-- repetition_penalty -->
{#if dynamicModelInfo.parameters.includes("repetition_penalty")}
  <ViewerButton
    key="repetition_penalty"
    value={currentContent.repetition_penalty}
    {fileId}
    fileType="risup"
  />
{/if}
<!-- reasoning_effort -->
{#if dynamicModelInfo.parameters.includes("reasoning_effort")}
  <ViewerButton
    key="reasoning_effort"
    value={currentContent.reasoning_effort}
    {fileId}
    fileType="risup"
  />
{/if}
<!-- verbosity -->
{#if dynamicModelInfo.parameters.includes("verbosity")}
  <ViewerButton key="verbosity" value={currentContent.verbosity} {fileId} fileType="risup" />
{/if}
{#if dynamicModelInfo.parameters.includes("frequency_penalty")}
  <ViewerButton
    key="frequencyPenalty"
    value={currentContent.frequencyPenalty}
    {fileId}
    fileType="risup"
  />
{/if}
{#if dynamicModelInfo.parameters.includes("presence_penalty")}
  <ViewerButton
    key="PresensePenalty"
    value={currentContent.PresensePenalty}
    {fileId}
    fileType="risup"
  />
{/if}
