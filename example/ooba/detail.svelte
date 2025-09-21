<!--
  Ooba Settings용 상세 입력 컴포넌트
  RisupDetail.svelte에 추가할 조건부 코드
-->

<!-- Ooba Mode 선택 -->
{:else if selectedKey === "ooba.mode"}
  <SelectInput bind:value={currentValue} className="mt-2 mb-4">
    <OptionInput value="instruct">Instruct</OptionInput>
    <OptionInput value="chat">Chat</OptionInput>
    <OptionInput value="chat-instruct">Chat-Instruct</OptionInput>
  </SelectInput>

<!-- Chat Format Settings (instructionMode 파라미터들) -->
{:else if selectedKey === "ooba.name1_instruct"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.name2_instruct"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.context_instruct"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.system_message"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.name1"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.name2"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.context"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.greeting"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.chat_instruct_command"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />

<!-- String Parameters -->
{:else if selectedKey === "ooba.tokenizer"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.negative_prompt"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.custom_token_bans"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />
{:else if selectedKey === "ooba.grammar_string"}
  <OptionalInput bind:value={currentValue} marginBottom={true} />

<!-- Number Parameters -->
{:else if selectedKey === "ooba.min_p"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.top_k"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.repetition_penalty"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.repetition_penalty_range"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.typical_p"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.tfs"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.top_a"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.epsilon_cutoff"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.eta_cutoff"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.guidance_scale"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.penalty_alpha"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.mirostat_mode"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.mirostat_tau"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.mirostat_eta"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.encoder_repetition_penalty"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.no_repeat_ngram_size"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.min_length"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.num_beams"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.length_penalty"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.truncation_length"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />
{:else if selectedKey === "ooba.max_tokens_second"}
  <OptionalInput bind:value={currentValue} marginBottom={true} numberMode />

<!-- Boolean Parameters -->
{:else if selectedKey === "ooba.temperature_last"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "ooba.do_sample"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "ooba.early_stopping"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "ooba.auto_max_new_tokens"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "ooba.ban_eos_token"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "ooba.add_bos_token"}
  <OptionalInput bind:value={currentValue} marginBottom={true} boolMode />
{:else if selectedKey === "ooba.skip_special_tokens"}
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