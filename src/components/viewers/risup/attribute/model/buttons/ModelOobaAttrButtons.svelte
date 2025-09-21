<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { currentRisupContent, risupStore } from "../../../../../../lib/stores/risup.store";
  import type { BotPreset } from "../../../../../../types/risu/preset.types";
  import { getModelInfo } from "../../../../../../lib/utils/modelList";
  import ViewerButton from "../../../../../ui/common/ViewerButton.svelte";
  import { LLMFormat } from "../../../../../../types/risu/llm/model.types";

  /**
   * ModelOobaAttrButtons 컴포넌트
   *
   * @example
   * <ModelOobaAttrButtons
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
  $: dynamicModelInfo = getModelInfo(currentContent?.aiModel || "");

  $: DBState = { db: currentContent };

  function changeValue(key: string, value: any) {}
</script>

{#if currentContent?.aiModel === "textgen_webui" || currentContent?.aiModel === "mancer" || currentContent?.aiModel?.startsWith("local_") || currentContent?.aiModel?.startsWith("hf:::")}
  <ViewerButton
    key="ooba.repetition_penalty"
    value={currentContent.ooba?.repetition_penalty}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ooba.length_penalty"
    value={currentContent.ooba?.length_penalty}
    {fileId}
    fileType="risup"
  />
  <ViewerButton key="ooba.top_k" value={currentContent.ooba?.top_k} {fileId} fileType="risup" />
  <ViewerButton key="ooba.top_p" value={currentContent.ooba?.top_p} {fileId} fileType="risup" />
  <ViewerButton
    key="ooba.typical_p"
    value={currentContent.ooba?.typical_p}
    {fileId}
    fileType="risup"
  />
  <ViewerButton key="ooba.top_a" value={currentContent.ooba?.top_a} {fileId} fileType="risup" />
  <ViewerButton
    key="ooba.no_repeat_ngram_size"
    value={currentContent.ooba?.no_repeat_ngram_size}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ooba.do_sample"
    value={currentContent.ooba?.do_sample}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ooba.add_bos_token"
    value={currentContent.ooba?.add_bos_token}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ooba.ban_eos_token"
    value={currentContent.ooba?.ban_eos_token}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ooba.skip_special_tokens"
    value={currentContent.ooba?.skip_special_tokens}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="localStopStrings"
    value={currentContent.localStopStrings}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ooba.formating.useName"
    value={currentContent.ooba?.formating?.useName}
    {fileId}
    fileType="risup"
  />
{/if}

<!-- NovelAI 모델 파라미터들 -->
{#if dynamicModelInfo.format === LLMFormat.NovelAI}
  <ViewerButton
    key="NAISettings.starter"
    value={currentContent.NAISettings?.starter}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.seperator"
    value={currentContent.NAISettings?.seperator}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.topP"
    value={currentContent.NAISettings?.topP}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.topK"
    value={currentContent.NAISettings?.topK}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.topA"
    value={currentContent.NAISettings?.topA}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.tailFreeSampling"
    value={currentContent.NAISettings?.tailFreeSampling}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.typicalp"
    value={currentContent.NAISettings?.typicalp}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.repetitionPenalty"
    value={currentContent.NAISettings?.repetitionPenalty}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.repetitionPenaltyRange"
    value={currentContent.NAISettings?.repetitionPenaltyRange}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.repetitionPenaltySlope"
    value={currentContent.NAISettings?.repetitionPenaltySlope}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.frequencyPenalty"
    value={currentContent.NAISettings?.frequencyPenalty}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.presencePenalty"
    value={currentContent.NAISettings?.presencePenalty}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.mirostat_lr"
    value={currentContent.NAISettings?.mirostat_lr}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.mirostat_tau"
    value={currentContent.NAISettings?.mirostat_tau}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="NAISettings.cfg_scale"
    value={currentContent.NAISettings?.cfg_scale}
    {fileId}
    fileType="risup"
  />
{/if}

<!-- NovelList 모델 파라미터들 -->
{#if dynamicModelInfo.format === LLMFormat.NovelList}
  <ViewerButton
    key="ainconfig.top_p"
    value={currentContent.ainconfig?.top_p}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ainconfig.rep_pen"
    value={currentContent.ainconfig?.rep_pen}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ainconfig.rep_pen_range"
    value={currentContent.ainconfig?.rep_pen_range}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ainconfig.rep_pen_slope"
    value={currentContent.ainconfig?.rep_pen_slope}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ainconfig.top_k"
    value={currentContent.ainconfig?.top_k}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ainconfig.top_a"
    value={currentContent.ainconfig?.top_a}
    {fileId}
    fileType="risup"
  />
  <ViewerButton
    key="ainconfig.typical_p"
    value={currentContent.ainconfig?.typical_p}
    {fileId}
    fileType="risup"
  />
{/if}
