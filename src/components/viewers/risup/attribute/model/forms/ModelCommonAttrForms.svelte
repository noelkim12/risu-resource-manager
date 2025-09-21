<script lang="ts">
  import { currentRisupContent } from "../../../../../../lib/stores/risup.store";
  import { getModelInfo } from "../../../../../../lib/utils/modelList";
  import { getNestedValue } from "../../../../../../lib/utils/util";
  import type { BotPreset } from "../../../../../../types/risu/preset.types";
  import SliderInput from "../../../../../ui/common/forms/SliderInput.svelte";
  import TextInput from "../../../../../ui/common/forms/TextInput.svelte";
  import NumberInput from "../../../../../ui/common/forms/NumberInput.svelte";
  import ModelList from "../../../../../ui/risup/ModelList.svelte";

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

{#if selectedKey === "aiModel"}
  <ModelList bind:value={currentValue} />
{:else if selectedKey === "subModel"}
  <ModelList bind:value={currentValue} />
{:else if selectedKey === "name"}
  <TextInput bind:value={currentValue} />
{:else if selectedKey === "thinkingTokens"}
  <SliderInput min={-1} max={64000} marginBottom step={200} bind:value={currentValue} disableable />
{:else if selectedKey === "maxContext"}
  <NumberInput min={0} marginBottom step={200} bind:value={currentValue} disableable />
{:else if selectedKey === "maxResponse"}
  <NumberInput min={0} marginBottom step={200} bind:value={currentValue} disableable />
{:else if selectedKey === "generationSeed"}
  <NumberInput marginBottom bind:value={currentValue} />
{:else if selectedKey === "temperature"}
  <SliderInput
    min={0}
    max={200}
    step={0.01}
    multiple={0.01}
    bind:value={currentValue}
    disableable
  />
{:else if selectedKey === "frequencyPenalty"}
  <SliderInput min={-1} max={1} marginBottom step={0.01} bind:value={currentValue} disableable />
{:else if selectedKey === "PresensePenalty"}
  <SliderInput min={-1} max={1} marginBottom step={0.01} bind:value={currentValue} disableable />
{:else if selectedKey === "repetition_penalty"}
  <SliderInput
    min={0}
    max={2}
    marginBottom
    step={0.01}
    fixed={2}
    bind:value={currentValue}
    disableable
  />
{:else if selectedKey === "reasoning_effort"}
  <SliderInput
    min={-1}
    max={2}
    marginBottom
    step={1}
    fixed={0}
    bind:value={currentValue}
    disableable
  />
{:else if selectedKey === "verbosity"}
  <SliderInput
    min={0}
    max={2}
    marginBottom
    step={1}
    fixed={0}
    bind:value={currentValue}
    disableable
  />
{:else if selectedKey === "PresensePenalty"}
  <SliderInput
    min={0}
    max={200}
    marginBottom
    fixed={2}
    multiple={0.01}
    bind:value={currentValue}
    disableable
  />
{:else if selectedKey === "top_p"}
  <SliderInput
    min={0}
    max={1}
    marginBottom
    step={0.01}
    fixed={2}
    bind:value={currentValue}
    disableable
  />
{:else if selectedKey === "frequency_penalty"}
  <SliderInput
    min={0}
    max={200}
    marginBottom
    fixed={2}
    multiple={0.01}
    bind:value={currentValue}
    disableable
  />
{:else if selectedKey === "top_k"}
  <SliderInput
    min={0}
    max={100}
    marginBottom
    step={1}
    fixed={2}
    bind:value={currentValue}
    disableable
  />
{/if}
