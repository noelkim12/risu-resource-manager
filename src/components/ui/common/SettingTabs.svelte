<script lang="ts">
  import { createEventDispatcher } from "svelte";

  interface Tab {
    name: string;
    label: string;
  }

  interface Props {
    tabs: Tab[];
    activeTab?: string;
    compact?: boolean;
    className?: string;
    children?: import("svelte").Snippet;
  }

  let {
    tabs = [],
    activeTab = $bindable(tabs[0]?.name || ""),
    compact = false,
    className = "",
    children
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleTabClick(tabName: string) {
    activeTab = tabName;
    dispatch("tabChange", { activeTab: tabName });
  }

  function handleKeydown(event: KeyboardEvent, tabName: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabClick(tabName);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const currentIndex = tabs.findIndex(tab => tab.name === activeTab);
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
      handleTabClick(tabs[nextIndex].name);
    }
  }
</script>

<!--
  SettingTabs 컴포넌트 - 설정 탭 시스템

  @example
  <SettingTabs {tabs} bind:activeTab compact={isCompact}>
    <SettingTab name="model" {activeTab}>
      모델 설정 컨텐츠
    </SettingTab>
  </SettingTabs>
-->

<div class="flex flex-col {className}">
  <!-- 탭 헤더 -->
  <div
    class="flex {compact ? 'space-x-1' : 'space-x-2'} mb-4 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
    role="tablist"
    aria-label="설정 탭"
  >
    {#each tabs as tab, index}
      <button
        type="button"
        class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 {compact ? 'text-xs' : ''} {
          activeTab === tab.name
            ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
        }"
        onclick={() => handleTabClick(tab.name)}
        onkeydown={(e) => handleKeydown(e, tab.name)}
        role="tab"
        aria-selected={activeTab === tab.name}
        aria-controls="tabpanel-{tab.name}"
        id="tab-{tab.name}"
        tabindex={activeTab === tab.name ? 0 : -1}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- 탭 컨텐츠 영역 -->
  <div class="flex-1 overflow-hidden">
    {@render children?.()}
  </div>
</div>