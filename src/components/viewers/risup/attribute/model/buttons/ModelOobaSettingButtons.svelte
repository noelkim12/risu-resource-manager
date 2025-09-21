<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { currentRisupContent, risupStore } from "../../../../../../lib/stores/risup.store";
  import type { BotPreset } from "../../../../../../types/risu/preset.types";
  import { getModelInfo } from "../../../../../../lib/utils/modelList";
  import Accordion from "../../../../../ui/common/Accordion.svelte";
  import ViewerButton from "../../../../../ui/common/ViewerButton.svelte";

  /**
   * ModelOobaSettingButtons 컴포넌트
   *
   * @example
   * <ModelOobaSettingButtons
   *   fileId="file123"
   *   instructionMode={true}
   * />
   */
  const dispatch = createEventDispatcher();

  // 컴포넌트 마운트 시 저장된 모든 risup 파일 로드
  onMount(() => {
    risupStore.loadAllContents();
  });

  export let fileId = "";
  export let instructionMode = false;

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

{#if (currentContent.reverseProxyOobaMode && currentContent.aiModel === "reverse_proxy") || currentContent.aiModel === "ooba"}
  <Accordion name="Ooba Settings" styled>
    <!-- Ooba Mode 선택 -->
    <ViewerButton
      key="reverseProxyOobaArgs.mode"
      value={currentContent.reverseProxyOobaArgs?.mode}
      {fileId}
      fileType="risup"
    />

    <!-- Chat Format Settings (instructionMode일 때만) -->
    {#if instructionMode}
      <!-- name1 = user | name2 = bot -->
      <ViewerButton
        key="reverseProxyOobaArgs.name1_instruct"
        value={currentContent.reverseProxyOobaArgs?.name1_instruct}
        {fileId}
        fileType="risup"
      />
      <ViewerButton
        key="reverseProxyOobaArgs.name2_instruct"
        value={currentContent.reverseProxyOobaArgs?.name2_instruct}
        {fileId}
        fileType="risup"
      />
      <ViewerButton
        key="reverseProxyOobaArgs.context_instruct"
        value={currentContent.reverseProxyOobaArgs?.context_instruct}
        {fileId}
        fileType="risup"
      />
      <ViewerButton
        key="reverseProxyOobaArgs.system_message"
        value={currentContent.reverseProxyOobaArgs?.system_message}
        {fileId}
        fileType="risup"
      />
      <ViewerButton
        key="reverseProxyOobaArgs.name1"
        value={currentContent.reverseProxyOobaArgs?.name1}
        {fileId}
        fileType="risup"
      />
      <ViewerButton
        key="reverseProxyOobaArgs.name2"
        value={currentContent.reverseProxyOobaArgs?.name2}
        {fileId}
        fileType="risup"
      />
      <ViewerButton
        key="reverseProxyOobaArgs.context"
        value={currentContent.reverseProxyOobaArgs?.context}
        {fileId}
        fileType="risup"
      />
      <ViewerButton
        key="reverseProxyOobaArgs.greeting"
        value={currentContent.reverseProxyOobaArgs?.greeting}
        {fileId}
        fileType="risup"
      />
      <ViewerButton
        key="reverseProxyOobaArgs.chat_instruct_command"
        value={currentContent.reverseProxyOobaArgs?.chat_instruct_command}
        {fileId}
        fileType="risup"
      />
    {/if}

    <!-- Core Ooba Parameters -->
    <ViewerButton
      key="reverseProxyOobaArgs.tokenizer"
      value={currentContent.reverseProxyOobaArgs?.tokenizer}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.min_p"
      value={currentContent.reverseProxyOobaArgs?.min_p}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.top_k"
      value={currentContent.reverseProxyOobaArgs?.top_k}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.repetition_penalty"
      value={currentContent.reverseProxyOobaArgs?.repetition_penalty}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.repetition_penalty_range"
      value={currentContent.reverseProxyOobaArgs?.repetition_penalty_range}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.typical_p"
      value={currentContent.reverseProxyOobaArgs?.typical_p}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.tfs"
      value={currentContent.reverseProxyOobaArgs?.tfs}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.top_a"
      value={currentContent.reverseProxyOobaArgs?.top_a}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.epsilon_cutoff"
      value={currentContent.reverseProxyOobaArgs?.epsilon_cutoff}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.eta_cutoff"
      value={currentContent.reverseProxyOobaArgs?.eta_cutoff}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.guidance_scale"
      value={currentContent.reverseProxyOobaArgs?.guidance_scale}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.penalty_alpha"
      value={currentContent.reverseProxyOobaArgs?.penalty_alpha}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.mirostat_mode"
      value={currentContent.reverseProxyOobaArgs?.mirostat_mode}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.mirostat_tau"
      value={currentContent.reverseProxyOobaArgs?.mirostat_tau}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.mirostat_eta"
      value={currentContent.reverseProxyOobaArgs?.mirostat_eta}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.encoder_repetition_penalty"
      value={currentContent.reverseProxyOobaArgs?.encoder_repetition_penalty}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.no_repeat_ngram_size"
      value={currentContent.reverseProxyOobaArgs?.no_repeat_ngram_size}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.min_length"
      value={currentContent.reverseProxyOobaArgs?.min_length}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.num_beams"
      value={currentContent.reverseProxyOobaArgs?.num_beams}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.length_penalty"
      value={currentContent.reverseProxyOobaArgs?.length_penalty}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.truncation_length"
      value={currentContent.reverseProxyOobaArgs?.truncation_length}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.max_tokens_second"
      value={currentContent.reverseProxyOobaArgs?.max_tokens_second}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.negative_prompt"
      value={currentContent.reverseProxyOobaArgs?.negative_prompt}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.custom_token_bans"
      value={currentContent.reverseProxyOobaArgs?.custom_token_bans}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.grammar_string"
      value={currentContent.reverseProxyOobaArgs?.grammar_string}
      {fileId}
      fileType="risup"
    />

    <!-- Boolean Parameters -->
    <ViewerButton
      key="reverseProxyOobaArgs.temperature_last"
      value={currentContent.reverseProxyOobaArgs?.temperature_last}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.do_sample"
      value={currentContent.reverseProxyOobaArgs?.do_sample}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.early_stopping"
      value={currentContent.reverseProxyOobaArgs?.early_stopping}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.auto_max_new_tokens"
      value={currentContent.reverseProxyOobaArgs?.auto_max_new_tokens}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.ban_eos_token"
      value={currentContent.reverseProxyOobaArgs?.ban_eos_token}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.add_bos_token"
      value={currentContent.reverseProxyOobaArgs?.add_bos_token}
      {fileId}
      fileType="risup"
    />
    <ViewerButton
      key="reverseProxyOobaArgs.skip_special_tokens"
      value={currentContent.reverseProxyOobaArgs?.skip_special_tokens}
      {fileId}
      fileType="risup"
    />

    <!-- Local Stop Strings (instructionMode일 때만) -->
    {#if instructionMode}
      <ViewerButton
        key="localStopStrings"
        value={currentContent.localStopStrings}
        {fileId}
        fileType="risup"
      />
    {/if}
  </Accordion>
{/if}
