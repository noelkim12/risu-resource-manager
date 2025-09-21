<script lang="ts">
  import { currentRisupContent } from "../../../../../../lib/stores/risup.store";
  import { getModelInfo } from "../../../../../../lib/utils/modelList";
  import { getNestedValue } from "../../../../../../lib/utils/util";
  import type { BotPreset } from "../../../../../../types/risu/preset.types";
  import SliderInput from "../../../../../ui/common/forms/SliderInput.svelte";
  import TextInput from "../../../../../ui/common/forms/TextInput.svelte";
  import NumberInput from "../../../../../ui/common/forms/NumberInput.svelte";
  import ModelList from "../../../../../ui/risup/ModelList.svelte";
  import CheckInput from "../../../../../ui/common/forms/CheckInput.svelte";
  import SelectInput from "../../../../../ui/common/forms/SelectInput.svelte";
  import OptionInput from "../../../../../ui/common/forms/OptionInput.svelte";

  /**
   * ModelCommonAttrForms 컴포넌트
   * @example
   * <ModelCommonAttrForms
   *   selectedKey={selectedKey}
   * />
   */
  export let selectedKey = null;

  // selection store에 현재 선택 상태 설정
  $: storeContent = $currentRisupContent;
  $: currentContent = (storeContent as BotPreset) || ({} as BotPreset);
  $: dynamicModelInfo = getModelInfo(currentContent?.aiModel || "");

  // 현재 값 계산 (중첩 경로 지원)
  $: currentValue = getNestedValue(currentContent, selectedKey);
  function formatValue(value) {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
</script>

{#if selectedKey === "openrouterFallback"}
  <CheckInput
    check={currentValue}
    onChange={() => {
      currentValue = !currentValue;
    }}
  />

  <!-- OpenRouter Middle Out (Boolean) -->
{:else if selectedKey === "openrouterMiddleOut"}
  <CheckInput
    check={currentValue}
    onChange={() => {
      currentValue = !currentValue;
    }}
  />

  <!-- Use Instruct Prompt (Boolean) -->
{:else if selectedKey === "useInstructPrompt"}
  <CheckInput
    check={currentValue}
    onChange={() => {
      currentValue = !currentValue;
    }}
  />

  <!-- Provider Selection (Select) -->
{:else if selectedKey === "openrouterProvider"}
  <SelectInput bind:value={currentValue}>
    <OptionInput value="">Auto (Default)</OptionInput>
    <OptionInput value="OpenAI">OpenAI</OptionInput>
    <OptionInput value="Anthropic">Anthropic</OptionInput>
    <OptionInput value="Google">Google</OptionInput>
    <OptionInput value="Google AI Studio">Google AI Studio</OptionInput>
    <OptionInput value="Amazon Bedrock">Amazon Bedrock</OptionInput>
    <OptionInput value="Groq">Groq</OptionInput>
    <OptionInput value="SambaNova">SambaNova</OptionInput>
    <OptionInput value="Cohere">Cohere</OptionInput>
    <OptionInput value="Mistral">Mistral</OptionInput>
    <OptionInput value="Together">Together</OptionInput>
    <OptionInput value="Together 2">Together 2</OptionInput>
    <OptionInput value="Fireworks">Fireworks</OptionInput>
    <OptionInput value="DeepInfra">DeepInfra</OptionInput>
    <OptionInput value="Lepton">Lepton</OptionInput>
    <OptionInput value="Novita">Novita</OptionInput>
    <OptionInput value="Avian">Avian</OptionInput>
    <OptionInput value="Lambda">Lambda</OptionInput>
    <OptionInput value="Azure">Azure</OptionInput>
    <OptionInput value="Modal">Modal</OptionInput>
    <OptionInput value="AnyScale">AnyScale</OptionInput>
    <OptionInput value="Replicate">Replicate</OptionInput>
    <OptionInput value="Perplexity">Perplexity</OptionInput>
    <OptionInput value="Recursal">Recursal</OptionInput>
    <OptionInput value="OctoAI">OctoAI</OptionInput>
    <OptionInput value="DeepSeek">DeepSeek</OptionInput>
    <OptionInput value="Infermatic">Infermatic</OptionInput>
    <OptionInput value="AI21">AI21</OptionInput>
    <OptionInput value="Featherless">Featherless</OptionInput>
    <OptionInput value="Inflection">Inflection</OptionInput>
    <OptionInput value="xAI">xAI</OptionInput>
    <OptionInput value="Cloudflare">Cloudflare</OptionInput>
    <OptionInput value="SF Compute">SF Compute</OptionInput>
    <OptionInput value="Minimax">Minimax</OptionInput>
    <OptionInput value="Nineteen">Nineteen</OptionInput>
    <OptionInput value="Liquid">Liquid</OptionInput>
    <OptionInput value="InferenceNet">InferenceNet</OptionInput>
    <OptionInput value="Friendli">Friendli</OptionInput>
    <OptionInput value="AionLabs">AionLabs</OptionInput>
    <OptionInput value="Alibaba">Alibaba</OptionInput>
    <OptionInput value="Nebius">Nebius</OptionInput>
    <OptionInput value="Chutes">Chutes</OptionInput>
    <OptionInput value="Kluster">Kluster</OptionInput>
    <OptionInput value="Crusoe">Crusoe</OptionInput>
    <OptionInput value="Targon">Targon</OptionInput>
    <OptionInput value="Ubicloud">Ubicloud</OptionInput>
    <OptionInput value="Parasail">Parasail</OptionInput>
    <OptionInput value="01.AI">01.AI</OptionInput>
    <OptionInput value="HuggingFace">HuggingFace</OptionInput>
    <OptionInput value="Mancer">Mancer</OptionInput>
    <OptionInput value="Mancer 2">Mancer 2</OptionInput>
    <OptionInput value="Hyperbolic">Hyperbolic</OptionInput>
    <OptionInput value="Hyperbolic 2">Hyperbolic 2</OptionInput>
    <OptionInput value="Lynn 2">Lynn 2</OptionInput>
    <OptionInput value="Lynn">Lynn</OptionInput>
    <OptionInput value="Reflection">Reflection</OptionInput>
  </SelectInput>
{/if}
