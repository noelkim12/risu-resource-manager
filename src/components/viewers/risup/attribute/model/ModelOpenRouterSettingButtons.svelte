<script lang="ts">
  import { language } from "$lib/i18n";
  import Accordion from "../../../../ui/common/Accordion.svelte";
  import Check from "../../../../ui/common/forms/CheckInput.svelte";
  import SelectInput from "../../../../ui/common/forms/SelectInput.svelte";
  import OptionInput from "../../../../ui/common/forms/OptionInput.svelte";
  import ChatFormatSettings from "../chat/ChatFormatSettings.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { currentRisupContent, risupStore } from "../../../../../lib/stores/risup.store";
  import type { BotPreset } from "../../../../../types/risu/preset.types";
  import { getModelInfo } from "../../../../../lib/utils/modelList";
  import ViewerButton from "../../../../ui/common/ViewerButton.svelte";

  /**
   * ModelOpenRouterSettingButtons 컴포넌트
   *
   * @example
   * <ModelOpenRouterSettingButtons
   *   fileId="file123"
   * />
   */
  const openrouterProviders = [
    "OpenAI",
    "Anthropic",
    "Google",
    "Google AI Studio",
    "Amazon Bedrock",
    "Groq",
    "SambaNova",
    "Cohere",
    "Mistral",
    "Together",
    "Together 2",
    "Fireworks",
    "DeepInfra",
    "Lepton",
    "Novita",
    "Avian",
    "Lambda",
    "Azure",
    "Modal",
    "AnyScale",
    "Replicate",
    "Perplexity",
    "Recursal",
    "OctoAI",
    "DeepSeek",
    "Infermatic",
    "AI21",
    "Featherless",
    "Inflection",
    "xAI",
    "Cloudflare",
    "SF Compute",
    "Minimax",
    "Nineteen",
    "Liquid",
    "InferenceNet",
    "Friendli",
    "AionLabs",
    "Alibaba",
    "Nebius",
    "Chutes",
    "Kluster",
    "Crusoe",
    "Targon",
    "Ubicloud",
    "Parasail",
    "01.AI",
    "HuggingFace",
    "Mancer",
    "Mancer 2",
    "Hyperbolic",
    "Hyperbolic 2",
    "Lynn 2",
    "Lynn",
    "Reflection",
  ].sort((a, b) => a.localeCompare(b));

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

<!-- OpenRouter Settings를 Accordion으로 그룹화 -->
{#if currentContent?.aiModel?.startsWith("openrouter")}
  <Accordion name="OpenRouter Settings" styled>
    <!-- OpenRouter Fallback -->
    <ViewerButton
      key="openrouterFallback"
      value={currentContent.openrouterFallback}
      {fileId}
      fileType="risup"
    />

    <!-- OpenRouter Middle Out -->
    <ViewerButton
      key="openrouterMiddleOut"
      value={currentContent.openrouterMiddleOut}
      {fileId}
      fileType="risup"
    />

    <!-- Use Instruct Prompt -->
    <ViewerButton
      key="useInstructPrompt"
      value={currentContent.useInstructPrompt}
      {fileId}
      fileType="risup"
    />

    <!-- Provider Selection -->
    <ViewerButton
      key="openrouterProvider"
      value={currentContent.openrouterProvider}
      {fileId}
      fileType="risup"
    />

    <!-- Chat Format Settings (useInstructPrompt가 true일 때만) -->
    {#if currentContent.useInstructPrompt}
      <!-- ChatFormatSettings 관련 필드들이 필요한 경우 여기에 추가 -->
      <!-- 예시: -->
      <!-- <ViewerButton
            key="chatFormat.systemPrefix"
            value={currentContent.chatFormat?.systemPrefix}
            {fileId}
            fileType="risup"
        /> -->
    {/if}
  </Accordion>
{/if}
