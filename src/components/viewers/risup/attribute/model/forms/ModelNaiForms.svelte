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

<!-- NovelAI 모델 파라미터들 -->
{#if selectedKey === "NAIsettings.starter"}
  <TextInput bind:value={currentValue} placeholder="⁂" />
{:else if selectedKey === "NAIsettings.seperator"}
  <TextInput bind:value={currentValue} placeholder="\\n" />
{:else if selectedKey === "NAIsettings.topP"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.topK"}
  <SliderInput min={0} max={100} step={1} marginBottom bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.topA"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.tailFreeSampling"}
  <SliderInput min={0} max={1} step={0.001} marginBottom fixed={3} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.typicalp"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.repetitionPenalty"}
  <SliderInput min={0} max={3} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.repetitionPenaltyRange"}
  <SliderInput min={0} max={8192} step={1} marginBottom fixed={0} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.repetitionPenaltySlope"}
  <SliderInput min={0} max={10} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.frequencyPenalty"}
  <SliderInput min={-2} max={2} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.presencePenalty"}
  <SliderInput min={-2} max={2} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.mirostat_lr"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.mirostat_tau"}
  <SliderInput min={0} max={6} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "NAIsettings.cfg_scale"}
  <SliderInput min={1} max={3} step={0.01} marginBottom fixed={2} bind:value={currentValue} />

  <!-- NovelList 모델 파라미터들 -->
{:else if selectedKey === "ainconfig.top_p"}
  <SliderInput min={0} max={2} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ainconfig.rep_pen"}
  <SliderInput min={0} max={2} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ainconfig.rep_pen_range"}
  <SliderInput min={0} max={2048} step={1} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ainconfig.rep_pen_slope"}
  <SliderInput min={0} max={10} step={0.1} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ainconfig.top_k"}
  <SliderInput min={1} max={500} step={1} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ainconfig.top_a"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ainconfig.typical_p"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{/if}
