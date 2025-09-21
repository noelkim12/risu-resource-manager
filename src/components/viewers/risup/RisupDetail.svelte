<script lang="ts">
  import ModelList from "../../ui/risup/ModelList.svelte";
  import { selectionStore } from "../../../lib/stores/selection.store";
  import { risupStore, currentRisupContent } from "../../../lib/stores/risup.store";
  import TextInput from "../../ui/common/forms/TextInput.svelte";
  import SliderInput from "../../ui/common/forms/SliderInput.svelte";
  import NumberInput from "../../ui/common/forms/NumberInput.svelte";
  import { getModelInfo } from "../../../lib/utils/modelList";
  import type { BotPreset } from "../../../types/risu/preset.types";
  import SelectInput from "../../ui/common/forms/SelectInput.svelte";
  import OptionInput from "../../ui/common/forms/OptionInput.svelte";
  import OptionalInput from "../../ui/common/forms/OptionalInput.svelte";
  import CheckInput from "../../ui/common/forms/CheckInput.svelte";

  /**
   * RisupDetail 컴포넌트
   * @example
   * <RisupDetail
   *   selectedFile={selectedFile}
   *   selectedKey={selectedKey}
   *   selectedValue={selectedValue}
   * />
   */
  export let selectedFile = null;
  export let selectedKey = null;

  // selection store에 현재 선택 상태 설정
  $: storeContent = $currentRisupContent;
  $: currentContent = (storeContent as BotPreset) || ({} as BotPreset);
  $: dynamicModelInfo = getModelInfo(currentContent?.aiModel || "");

  // 중첩된 객체 속성에 안전하게 접근하는 함수
  function getNestedValue(obj: any, path: string | null): any {
    if (!obj || !path) return undefined;

    // 일반적인 속성 접근
    if (path in obj) {
      return obj[path];
    }

    // 점으로 구분된 경로 처리 (예: "reverseProxyOobaArgs.mode")
    if (path.includes(".")) {
      const [prefix, ...rest] = path.split(".");
      const remainingPath = rest.join(".");

      // ooba 설정들은 reverseProxyOobaArgs에 있음
      if (prefix === "ooba" && obj.reverseProxyOobaArgs) {
        return getNestedValue(obj.reverseProxyOobaArgs, remainingPath);
      }

      // NAI 설정들은 NAIsettings에 있음
      if (prefix === "NAIsettings" && obj.NAIsettings) {
        return getNestedValue(obj.NAIsettings, remainingPath);
      }

      // ainconfig 설정들은 ainconfig에 있음
      if (prefix === "ainconfig" && obj.ainconfig) {
        return getNestedValue(obj.ainconfig, remainingPath);
      }

      // 기타 중첩 객체 접근
      if (prefix in obj) {
        return getNestedValue(obj[prefix], remainingPath);
      }
    }

    return undefined;
  }

  // 중첩된 객체 속성에 값을 설정하는 함수
  function setNestedValue(obj: any, path: string | null, value: any): void {
    if (!obj || !path) return;

    // 일반적인 속성 설정
    if (!path.includes(".")) {
      obj[path] = value;
      return;
    }

    // 점으로 구분된 경로 처리 (예: "reverseProxyOobaArgs.mode")
    const [prefix, ...rest] = path.split(".");
    const remainingPath = rest.join(".");

    // ooba 설정들은 reverseProxyOobaArgs에 설정
    if (prefix === "ooba") {
      if (!obj.reverseProxyOobaArgs) {
        obj.reverseProxyOobaArgs = {};
      }
      setNestedValue(obj.reverseProxyOobaArgs, remainingPath, value);
      return;
    }

    // NAI 설정들은 NAIsettings에 설정
    if (prefix === "NAIsettings") {
      if (!obj.NAIsettings) {
        obj.NAIsettings = {};
      }
      setNestedValue(obj.NAIsettings, remainingPath, value);
      return;
    }

    // ainconfig 설정들은 ainconfig에 설정
    if (prefix === "ainconfig") {
      if (!obj.ainconfig) {
        obj.ainconfig = {};
      }
      setNestedValue(obj.ainconfig, remainingPath, value);
      return;
    }

    // 기타 중첩 객체 설정
    if (!obj[prefix]) {
      obj[prefix] = {};
    }
    setNestedValue(obj[prefix], remainingPath, value);
  }

  // 현재 값 계산 (중첩 경로 지원)
  $: currentValue = getNestedValue(currentContent, selectedKey);
  function formatValue(value) {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
</script>

<div>
  {#if selectedKey === "aiModel"}
    <ModelList bind:value={currentValue} />
  {:else if selectedKey === "subModel"}
    <ModelList bind:value={currentValue} />
  {:else if selectedKey === "name"}
    <TextInput bind:value={currentValue} />
  {:else if selectedKey === "thinkingTokens"}
    <SliderInput
      min={-1}
      max={64000}
      marginBottom
      step={200}
      bind:value={currentValue}
      disableable
    />
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
  {:else if selectedKey === "reverseProxyOobaArgs.repetition_penalty"}
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

    <!-- NovelAI 모델 파라미터들 -->
  {:else if selectedKey === "NAIsettings.starter"}
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
  {:else if selectedKey === "reverseProxyOobaArgs.mode"}
    <SelectInput bind:value={currentValue} className="mt-2 mb-4">
      <OptionInput value="instruct">Instruct</OptionInput>
      <OptionInput value="chat">Chat</OptionInput>
      <OptionInput value="chat-instruct">Chat-Instruct</OptionInput>
    </SelectInput>

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
  {:else if selectedKey === "openrouterFallback"}
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
  {:else}
    <pre class="rrm-detail-pre">{formatValue(currentValue)}</pre>
  {/if}
</div>
