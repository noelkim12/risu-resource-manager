<!--
  RisupDetail에 추가할 파라미터별 입력 컴포넌트 코드
  기존 조건문들 사이에 삽입하세요
-->

<!-- ooba/textgen 모델 파라미터들 -->
{:else if selectedKey === "ooba.repetition_penalty"}
  <SliderInput min={1} max={1.5} step={0.01} fixed={2} marginBottom bind:value={currentValue} />
{:else if selectedKey === "ooba.length_penalty"}
  <SliderInput min={-5} max={5} step={0.05} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ooba.top_k"}
  <SliderInput min={0} max={100} step={1} marginBottom bind:value={currentValue} />
{:else if selectedKey === "ooba.top_p"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ooba.typical_p"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ooba.top_a"}
  <SliderInput min={0} max={1} step={0.01} marginBottom fixed={2} bind:value={currentValue} />
{:else if selectedKey === "ooba.no_repeat_ngram_size"}
  <SliderInput min={0} max={20} step={1} marginBottom bind:value={currentValue} />
{:else if selectedKey === "ooba.do_sample"}
  <input type="checkbox" bind:checked={currentValue} class="form-checkbox" />
{:else if selectedKey === "ooba.add_bos_token"}
  <input type="checkbox" bind:checked={currentValue} class="form-checkbox" />
{:else if selectedKey === "ooba.ban_eos_token"}
  <input type="checkbox" bind:checked={currentValue} class="form-checkbox" />
{:else if selectedKey === "ooba.skip_special_tokens"}
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
{:else if selectedKey === "ooba.formating.useName"}
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
{/if}

<!-- 기본 폴백: JSON 표시 -->
<!-- else 조건은 이미 기존 코드에 있으므로 추가 안함 -->
