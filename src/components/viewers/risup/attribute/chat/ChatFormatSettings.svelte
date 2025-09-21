<script lang="ts">
  import TextAreaInput from "../../../../ui/common/forms/TextAreaInput.svelte";
  import SelectInput from "../../../../ui/common/forms/SelectInput.svelte";
  import OptionInput from "../../../../ui/common/forms/OptionInput.svelte";

  import { language } from "$lib/i18n";
  import { risupStore, currentRisupContent } from "../../../../../lib/stores/risup.store";
  import type { BotPreset } from "../../../../../types/risu/preset.types";
  import { getModelInfo } from "../../../../../lib/utils/modelList";

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

  function changeValue(key: string, value: any) {}
</script>

<span class="text-textcolor">{language.chatFormating}</span>
<SelectInput bind:value={currentContent.instructChatTemplate}>
  <OptionInput value="chatml">ChatML</OptionInput>
  <OptionInput value="llama3">Llama3</OptionInput>
  <OptionInput value="gpt2">GPT2</OptionInput>
  <OptionInput value="gemma">Gemma</OptionInput>
  <OptionInput value="mistral">Mistral</OptionInput>
  <OptionInput value="llama2">Llama2</OptionInput>
  <OptionInput value="vicuna">Vicuna</OptionInput>
  <OptionInput value="alpaca">Alpaca</OptionInput>
  <OptionInput value="jinja">Custom (Jinja)</OptionInput>
</SelectInput>

{#if currentContent.instructChatTemplate === "jinja"}
  <span class="text-textcolor">Jinja Template</span>
  <TextAreaInput fullwidth autocomplete="off" bind:value={currentContent.JinjaTemplate} />
{/if}
