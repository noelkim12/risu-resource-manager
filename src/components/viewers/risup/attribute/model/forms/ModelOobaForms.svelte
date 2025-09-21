<script lang="ts">
  import { currentRisupContent } from "../../../../../../lib/stores/risup.store";
  import { getModelInfo } from "../../../../../../lib/utils/modelList";
  import { getNestedValue } from "../../../../../../lib/utils/util";
  import type { BotPreset } from "../../../../../../types/risu/preset.types";
  import SliderInput from "../../../../../ui/common/forms/SliderInput.svelte";
  import TextInput from "../../../../../ui/common/forms/TextInput.svelte";
  import NumberInput from "../../../../../ui/common/forms/NumberInput.svelte";
  import ModelList from "../../../../../ui/risup/ModelList.svelte";
  import OptionalInput from "../../../../../ui/common/forms/OptionalInput.svelte";

  /**
   * ModelOobaForm 컴포넌트
   * @example
   * <ModelOobaForm
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

{#if selectedKey === "reverseProxyOobaArgs.repetition_penalty"}
  <SliderInput min={1} max={1.5} step={0.01} fixed={2} marginBottom bind:value={currentValue} />
{:else if selectedKey === "reverseProxyOobaArgs.length_penalty"}
  <SliderInput min={-5} max={5} step={0.05} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "reverseProxyOobaArgs.top_k"}
  <SliderInput min={0} max={100} step={1} marginBottom bind:value={currentValue} />
{:else if selectedKey === "reverseProxyOobaArgs.top_p"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "reverseProxyOobaArgs.typical_p"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "reverseProxyOobaArgs.top_a"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "reverseProxyOobaArgs.no_repeat_ngram_size"}
  <SliderInput min={0} max={20} step={1} marginBottom bind:value={currentValue} />
{:else if selectedKey === "reverseProxyOobaArgs.do_sample"}
  <input type="checkbox" bind:checked={currentValue} class="form-checkbox" />
{:else if selectedKey === "reverseProxyOobaArgs.add_bos_token"}
  <input type="checkbox" bind:checked={currentValue} class="form-checkbox" />
{:else if selectedKey === "reverseProxyOobaArgs.ban_eos_token"}
  <input type="checkbox" bind:checked={currentValue} class="form-checkbox" />
{:else if selectedKey === "reverseProxyOobaArgs.skip_special_tokens"}
  <input type="checkbox" bind:checked={currentValue} class="form-checkbox" />
{:else if selectedKey === "localStopStrings"}
  <div class="space-y-2">
    {#if Array.isArray(currentValue)}
      {#each currentValue as stopString, i}
        <div class="flex gap-2">
          <TextInput bind:value={currentValue[i]} placeholder="Stop string" className="flex-1" />
          <button
            class="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
            onclick={() => {
              currentValue.splice(i, 1);
              currentValue = [...currentValue];
            }}
          >
            Remove
          </button>
        </div>
      {/each}
    {/if}
    <button
      class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
      onclick={() => {
        if (!Array.isArray(currentValue)) {
          currentValue = [];
        }
        currentValue = [...currentValue, ""];
      }}
    >
      Add Stop String
    </button>
  </div>
{:else if selectedKey === "reverseProxyOobaArgs.formating.useName"}
  <input type="checkbox" bind:checked={currentValue} class="form-checkbox" />

  <!-- Chat Format Settings (instructionMode 파라미터들) -->
{:else if selectedKey === "reverseProxyOobaArgs.name1_instruct"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.name2_instruct"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.context_instruct"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.system_message"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.name1"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.name2"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.context"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.greeting"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.chat_instruct_command"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />

  <!-- String Parameters -->
{:else if selectedKey === "reverseProxyOobaArgs.tokenizer"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.negative_prompt"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.custom_token_bans"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "reverseProxyOobaArgs.grammar_string"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />

  <!-- Number Parameters -->
{:else if selectedKey === "reverseProxyOobaArgs.min_p"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.top_k"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.repetition_penalty"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.repetition_penalty_range"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.typical_p"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.tfs"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.top_a"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.epsilon_cutoff"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.eta_cutoff"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.guidance_scale"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.penalty_alpha"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.mirostat_mode"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.mirostat_tau"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.mirostat_eta"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.encoder_repetition_penalty"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.no_repeat_ngram_size"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.min_length"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.num_beams"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.length_penalty"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.truncation_length"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "reverseProxyOobaArgs.max_tokens_second"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />

  <!-- Boolean Parameters -->
{:else if selectedKey === "reverseProxyOobaArgs.temperature_last"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "reverseProxyOobaArgs.do_sample"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "reverseProxyOobaArgs.early_stopping"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "reverseProxyOobaArgs.auto_max_new_tokens"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "reverseProxyOobaArgs.ban_eos_token"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "reverseProxyOobaArgs.add_bos_token"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "reverseProxyOobaArgs.skip_special_tokens"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />

  <!-- Local Stop Strings (Array handling) -->
{:else if selectedKey === "localStopStrings"}
  <div class="space-y-2">
    {#if Array.isArray(currentValue)}
      {#each currentValue as stopString, i}
        <div class="flex gap-2">
          <TextInput bind:value={currentValue[i]} placeholder="Stop string" className="flex-1" />
          <button
            class="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
            onclick={() => {
              currentValue.splice(i, 1);
              currentValue = [...currentValue];
            }}
          >
            Remove
          </button>
        </div>
      {/each}
    {/if}
    <button
      class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
      onclick={() => {
        if (!Array.isArray(currentValue)) {
          currentValue = [];
        }
        currentValue = [...currentValue, ""];
      }}
    >
      Add Stop String
    </button>
  </div>
{:else if selectedKey === "reverseProxyOobaArgs.mode"}
  <SelectInput bind:value={currentValue} className="mt-2 mb-4">
    <OptionInput value="instruct">Instruct</OptionInput>
    <OptionInput value="chat">Chat</OptionInput>
    <OptionInput value="chat-instruct">Chat-Instruct</OptionInput>
  </SelectInput>
{/if}
