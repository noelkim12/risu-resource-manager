<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { getHordeModels } from "$lib/utils/modelUtil";
  import Accordion from "../common/Accordion.svelte";
  import { language } from "$lib/i18n/index";
  import CheckInput from "../common/forms/CheckInput.svelte";
  import { getModelInfo, getModelList } from "$lib/utils/modelList";
  import { ArrowLeft } from "lucide-svelte";
  import { risupStore } from "../../../lib/stores/risup.store";
  import { currentSelection } from "../../../lib/stores/selection.store";
  import type { BotPreset } from "../../../types/risu/preset.types";

  const dispatch = createEventDispatcher();

  interface Props {
    value?: string;
    onChange?: (v: string) => void;
    onclick?: (
      event: MouseEvent & {
        currentTarget: EventTarget & HTMLDivElement;
      }
    ) => any;
    blankable?: boolean;
  }

  let {
    value = $bindable(""),
    onChange = (v) => {},
    onclick: onclick,
    blankable,
  }: Props = $props();
  let openOptions = $state(false);

  function changeModel(name: string) {
    value = name;
    openOptions = false;
    onChange(name);

    // selection store에서 현재 선택 정보 가져와서 store 업데이트
    const selection = $currentSelection;
    if (selection.isComplete && selection.fileType === "risup") {
      risupStore.updateKey(selection.fileId, selection.fieldKey as keyof BotPreset, name);
    }

    dispatch("change", name);
  }
  let showUnrec = $state(false);
  let providers = $derived(
    getModelList({
      recommendedOnly: !showUnrec,
      groupedByProvider: true,
    })
  );
</script>

{#if openOptions}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/20"
    role="button"
    tabindex="0"
    onclick={() => {
      openOptions = false;
    }}
  >
    <div
      class="flex max-h-full w-96 max-w-full flex-col overflow-x-hidden overflow-y-auto rounded-lg bg-white p-4 shadow-lg"
      role="button"
      tabindex="0"
      onclick={(e) => {
        e.stopPropagation();
        onclick?.(e);
      }}
    >
      <div class="mb-4 flex items-center gap-3">
        <button
          class="flex flex-shrink-0 items-center justify-center rounded-lg p-2 transition-colors hover:bg-blue-50"
          onclick={() => {
            openOptions = false;
          }}
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 class="flex-1 text-xl font-bold">{language.model}</h1>
      </div>
      <div class="mb-4 border-t border-gray-200"></div>

      {#each providers as provider}
        {#if provider.providerName === "@as-is"}
          {#each provider.models as model}
            <button
              class="mb-2 w-full rounded-lg border-2 border-gray-300 p-3 text-left text-gray-800 transition-colors hover:border-blue-400 hover:bg-blue-50"
              onclick={() => {
                changeModel(model.id);
              }}>{model.name}</button
            >
          {/each}
        {:else}
          <Accordion name={provider.providerName}>
            {#each provider.models as model}
              <button
                class="mb-2 w-full rounded-lg border-2 border-gray-300 p-3 text-left text-gray-800 transition-colors hover:border-blue-400 hover:bg-blue-50"
                onclick={() => {
                  changeModel(model.id);
                }}>{model.name}</button
              >
            {/each}
          </Accordion>
        {/if}
      {/each}
      <Accordion name="Horde">
        {#await getHordeModels()}
          <button class="w-full rounded-lg border border-gray-200 p-3 text-left text-gray-600"
            >Loading...</button
          >
        {:then models}
          <button
            onclick={() => {
              changeModel("horde:::" + "auto");
            }}
            class="mb-2 w-full rounded-lg border-2 border-gray-300 p-3 text-left text-gray-800 transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            <div class="font-medium">Auto Model</div>
            <div class="text-sm text-gray-500">Performance: Auto</div>
          </button>
          {#each models as model}
            <button
              onclick={() => {
                changeModel("horde:::" + model.name);
              }}
              class="mb-2 w-full rounded-lg border-2 border-gray-300 p-3 text-left text-gray-800 transition-colors hover:border-blue-400 hover:bg-blue-50"
            >
              <div class="font-medium">{model.name.trim()}</div>
              <div class="text-sm text-gray-500">Performance: {model.performance.toFixed(1)}</div>
            </button>
          {/each}
        {/await}
      </Accordion>

      {#if blankable}
        <button
          class="mb-2 w-full rounded-lg border-2 border-gray-300 p-3 text-left text-gray-800 transition-colors hover:border-blue-400 hover:bg-blue-50"
          onclick={() => {
            changeModel("");
          }}>{language.none}</button
        >
      {/if}
      <div class="mt-4 text-sm text-gray-600">
        <CheckInput name={language.showUnrecommended} grayText bind:check={showUnrec} />
      </div>
    </div>
  </div>
{/if}

<button
  onclick={() => {
    openOptions = true;
  }}
  class="mb-4 w-full rounded-lg border-2 border-gray-300 p-3 text-left text-gray-800 transition-colors hover:border-blue-400 hover:bg-blue-50"
>
  <div class="font-medium">{getModelInfo(value)?.fullName || language.none}</div>
</button>
