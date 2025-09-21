<script lang="ts">
  import { currentContent } from "$lib/store/currentContent";
  import SliderInput from "./ui/common/SliderInput.svelte";
  import Check from "./ui/common/Check.svelte";
  import TextInput from "./ui/common/TextInput.svelte";
  import { PlusIcon } from "lucide-svelte";
  import { TrashIcon } from "lucide-svelte";
  import ChatFormatSettings from "./ui/common/ChatFormatSettings.svelte";
  import { LLMFormat } from "$lib/types/risu/preset.types";
  import { dynamicModelInfo } from "$lib/store/dynamicModelInfo";
  import { language } from "$lib/store/language";
</script>

{#if currentContent.aiModel === "textgen_webui" || currentContent.aiModel === "mancer" || currentContent.aiModel.startsWith("local_") || currentContent.aiModel.startsWith("hf:::")}
  <span class="text-textcolor">Repetition Penalty</span>
  <SliderInput
    min={1}
    max={1.5}
    step={0.01}
    fixed={2}
    marginBottom
    bind:value={currentContent.ooba.repetition_penalty}
  />
  <span class="text-textcolor">Length Penalty</span>
  <SliderInput
    min={-5}
    max={5}
    step={0.05}
    marginBottom
    fixed={2}
    bind:value={currentContent.ooba.length_penalty}
  />
  <span class="text-textcolor">Top K</span>
  <SliderInput min={0} max={100} step={1} marginBottom bind:value={currentContent.ooba.top_k} />
  <span class="text-textcolor">Top P</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.ooba.top_p}
  />
  <span class="text-textcolor">Typical P</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.ooba.typical_p}
  />
  <span class="text-textcolor">Top A</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.ooba.top_a}
  />
  <span class="text-textcolor">No Repeat n-gram Size</span>
  <SliderInput
    min={0}
    max={20}
    step={1}
    marginBottom
    bind:value={currentContent.ooba.no_repeat_ngram_size}
  />
  <div class="mt-4 flex items-center">
    <Check bind:check={currentContent.ooba.do_sample} name={"Do Sample"} />
  </div>
  <div class="mt-4 flex items-center">
    <Check bind:check={currentContent.ooba.add_bos_token} name={"Add BOS Token"} />
  </div>
  <div class="mt-4 flex items-center">
    <Check bind:check={currentContent.ooba.ban_eos_token} name={"Ban EOS Token"} />
  </div>
  <div class="mt-4 flex items-center">
    <Check bind:check={currentContent.ooba.skip_special_tokens} name={"Skip Special Tokens"} />
  </div>
  <div class="mt-4 flex items-center">
    <Check
      check={!!currentContent.localStopStrings}
      name={language.customStopWords}
      onChange={() => {
        if (!currentContent.localStopStrings) {
          currentContent.localStopStrings = [];
        } else {
          currentContent.localStopStrings = null;
        }
      }}
    />
  </div>
  {#if currentContent.localStopStrings}
    <div class="border-selected mt-2 flex flex-col gap-1 rounded border p-2">
      <div class="p-2">
        <button
          class="flex h-full w-full cursor-pointer items-center justify-center font-medium hover:text-green-500"
          onclick={() => {
            let localStopStrings = currentContent.localStopStrings;
            localStopStrings.push("");
            currentContent.localStopStrings = localStopStrings;
          }}><PlusIcon /></button
        >
      </div>
      {#each currentContent.localStopStrings as stopString, i}
        <div class="flex w-full">
          <div class="flex-grow">
            <TextInput
              marginBottom
              bind:value={currentContent.localStopStrings[i]}
              fullwidth
              fullh
            />
          </div>
          <div>
            <button
              class="flex h-full w-full cursor-pointer items-center justify-center font-medium hover:text-green-500"
              onclick={() => {
                let localStopStrings = currentContent.localStopStrings;
                localStopStrings.splice(i, 1);
                currentContent.localStopStrings = localStopStrings;
              }}><TrashIcon /></button
            >
          </div>
        </div>
      {/each}
    </div>
  {/if}
  <div class="border-selected mt-4 flex flex-col rounded-md border p-3">
    <ChatFormatSettings />
  </div>
  <Check bind:check={currentContent.ooba.formating.useName} name={language.useNamePrefix} />
{:else if dynamicModelInfo.format === LLMFormat.NovelAI}
  <div class="bg-darkbg mt-4 flex flex-col p-3">
    <span class="text-textcolor">Starter</span>
    <TextInput bind:value={currentContent.NAIsettings.starter} placeholder={"⁂"} />
    <span class="text-textcolor">Seperator</span>
    <TextInput bind:value={currentContent.NAIsettings.seperator} placeholder={"\\n"} />
  </div>
  <span class="text-textcolor">Top P</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.topP}
  />
  <span class="text-textcolor">Top K</span>
  <SliderInput
    min={0}
    max={100}
    step={1}
    marginBottom
    bind:value={currentContent.NAIsettings.topK}
  />
  <span class="text-textcolor">Top A</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.topA}
  />
  <span class="text-textcolor">Tailfree Sampling</span>
  <SliderInput
    min={0}
    max={1}
    step={0.001}
    marginBottom
    fixed={3}
    bind:value={currentContent.NAIsettings.tailFreeSampling}
  />
  <span class="text-textcolor">Typical P</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.typicalp}
  />
  <span class="text-textcolor">Repetition Penalty</span>
  <SliderInput
    min={0}
    max={3}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.repetitionPenalty}
  />
  <span class="text-textcolor">Repetition Penalty Range</span>
  <SliderInput
    min={0}
    max={8192}
    step={1}
    marginBottom
    fixed={0}
    bind:value={currentContent.NAIsettings.repetitionPenaltyRange}
  />
  <span class="text-textcolor">Repetition Penalty Slope</span>
  <SliderInput
    min={0}
    max={10}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.repetitionPenaltySlope}
  />
  <span class="text-textcolor">Frequency Penalty</span>
  <SliderInput
    min={-2}
    max={2}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.frequencyPenalty}
  />
  <span class="text-textcolor">Presence Penalty</span>
  <SliderInput
    min={-2}
    max={2}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.presencePenalty}
  />
  <span class="text-textcolor">Mirostat LR</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.mirostat_lr}
  />
  <span class="text-textcolor">Mirostat Tau</span>
  <SliderInput
    min={0}
    max={6}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.mirostat_tau}
  />
  <span class="text-textcolor">Cfg Scale</span>
  <SliderInput
    min={1}
    max={3}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.NAIsettings.cfg_scale}
  />
{:else if dynamicModelInfo.format === LLMFormat.NovelList}
  <span class="text-textcolor">Top P</span>
  <SliderInput
    min={0}
    max={2}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.ainconfig.top_p}
  />
  <span class="text-textcolor">Reputation Penalty</span>
  <SliderInput
    min={0}
    max={2}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.ainconfig.rep_pen}
  />
  <span class="text-textcolor">Reputation Penalty Range</span>
  <SliderInput
    min={0}
    max={2048}
    step={1}
    marginBottom
    fixed={2}
    bind:value={currentContent.ainconfig.rep_pen_range}
  />
  <span class="text-textcolor">Reputation Penalty Slope</span>
  <SliderInput
    min={0}
    max={10}
    step={0.1}
    marginBottom
    fixed={2}
    bind:value={currentContent.ainconfig.rep_pen_slope}
  />
  <span class="text-textcolor">Top K</span>
  <SliderInput
    min={1}
    max={500}
    step={1}
    marginBottom
    fixed={2}
    bind:value={currentContent.ainconfig.top_k}
  />
  <span class="text-textcolor">Top A</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.ainconfig.top_a}
  />
  <span class="text-textcolor">Typical P</span>
  <SliderInput
    min={0}
    max={1}
    step={0.01}
    marginBottom
    fixed={2}
    bind:value={currentContent.ainconfig.typical_p}
  />
{:else}{/if}
