<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { language } from "$lib/i18n";
  import ModelList from "../../ui/risup/ModelList.svelte";
  import Help from "../../ui/common/others/Help.svelte";
  import { getModelInfo } from "../../../lib/utils/modelList";
  import { risupStore, currentRisupContent } from "../../../lib/stores/risup.store";
  import ViewerButton from "../../ui/common/ViewerButton.svelte";
  import SliderInput from "../../ui/common/forms/SliderInput.svelte";
  import ModelCommonAttrButtons from "./attribute/model/buttons/ModelCommonAttrButtons.svelte";
  import type { BotPreset } from "../../../types/risu/preset.types";
  import { FileText } from "lucide-svelte";
  import { jsonModalStore } from "../../../lib/stores/jsonModal.store";
  import SettingTabs from "../../ui/common/SettingTabs.svelte";
  import SettingTab from "../../ui/common/SettingTab.svelte";
  import ModelConditionalAttrButtons from "./attribute/model/buttons/ModelConditionalAttrButtons.svelte";
  import ModelOobaAttrButtons from "./attribute/model/buttons/ModelOobaAttrButtons.svelte";
  import ModelOobaSettingButtons from "./attribute/model/buttons/ModelOobaSettingButtons.svelte";
  import ModelOpenRouterSettingButtons from "./attribute/model/buttons/ModelOpenRouterSettingButtons.svelte";

  /**
   * RisupViewer 컴포넌트
   *
   * @example
   * <RisupViewer
   *   parsedContent={parsedContent}
   *   parseError={parseError}
   *   on:keySelect={handleKeyClick}
   * />
   */
  const dispatch = createEventDispatcher();

  interface Props {
    parsedContent?: any;
    parseError?: string | null;
    fileId?: string;
  }

  let { parsedContent = null, parseError = null, fileId = "" }: Props = $props();

  // 컴포넌트 마운트 시 저장된 모든 risup 파일 로드
  onMount(() => {
    risupStore.loadAllContents();
  });

  // fileId가 변경될 때 store에 content 설정 및 저장소에서 로드
  $effect(() => {
    if (fileId) {
      // 먼저 저장소에서 기존 내용 로드 시도
      risupStore.loadContent(fileId).then((loadedContent) => {
        // 저장소에 내용이 없고 props로 새 content가 있으면 설정
        if (!loadedContent && parsedContent) {
          risupStore.setContent(fileId, parsedContent);
        }
      });

      risupStore.selectFile(fileId);
    }
  });

  // store에서 현재 content 가져오기 (store 우선, props는 백업)
  const storeContent = $derived($currentRisupContent);
  const currentContent = $derived((storeContent as BotPreset) || ({} as BotPreset));
  const keys = $derived(currentContent ? Object.keys(currentContent) : []);
  const dynamicModelInfo = $derived(getModelInfo(currentContent?.aiModel || ""));

  const DBState = $derived({ db: currentContent });

  // 탭 설정
  const tabs = [
    { name: "model", label: "모델" },
    { name: "prompt", label: "프롬프트" },
    { name: "etc", label: "기타" },
  ];

  let activeTab = $state("model");

  function changeValue(key: string, value: any) {}

  function openJsonModal() {
    if (currentContent) {
      jsonModalStore.open("RISUP 파일 JSON 전체 보기", currentContent);
    }
  }
</script>

<div class="flex h-full flex-col">
  {#if parseError}
    <div class="flex flex-1 items-center justify-center">
      <div class="p-6 text-center">
        <div class="mb-2 font-semibold text-red-500">파싱 오류</div>
        <div class="text-sm text-gray-600">{parseError}</div>
      </div>
    </div>
  {:else if !parsedContent}
    <div class="flex flex-1 items-center justify-center">
      <div class="text-gray-500">파일을 선택하세요</div>
    </div>
  {:else}
    <div class="flex-1 overflow-hidden">
      <div class="h-full overflow-y-auto p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">RISUP 파일 키 목록</h3>
          <button
            type="button"
            onclick={openJsonModal}
            class="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            title="전체 JSON 보기"
          >
            <FileText class="h-4 w-4" />
            JSON 보기
          </button>
        </div>

        <SettingTabs {tabs} bind:activeTab>
          <SettingTab name="model" {activeTab}>
            <ModelCommonAttrButtons {fileId} />
            <ModelConditionalAttrButtons {fileId} />
            <ModelOobaAttrButtons {fileId} />
            <ModelOobaSettingButtons {fileId} />
            <ModelOpenRouterSettingButtons {fileId} />
          </SettingTab>

          <SettingTab name="prompt" {activeTab}>
            <!-- 추후 프롬프트 관련 컴포넌트 추가 예정 -->
            <div
              class="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center dark:border-yellow-600 dark:bg-yellow-900/20"
            >
              <p class="text-sm text-yellow-600 dark:text-yellow-400">
                프롬프트 설정은 추후 추가될 예정입니다.
              </p>
            </div>
          </SettingTab>

          <SettingTab name="etc" {activeTab}>
            <!-- 추후 기타 설정 컴포넌트 추가 예정 -->
            <div
              class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-600 dark:bg-gray-800"
            >
              <p class="text-sm text-gray-600 dark:text-gray-400">
                기타 설정은 추후 추가될 예정입니다.
              </p>
            </div>
          </SettingTab>
        </SettingTabs>
      </div>
    </div>
  {/if}
</div>
