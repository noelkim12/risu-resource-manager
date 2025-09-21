<script lang="ts">
  interface Props {
    name: string;
    activeTab: string;
    className?: string;
    children?: import("svelte").Snippet;
  }

  let { name, activeTab, className = "", children }: Props = $props();

  // 현재 탭이 활성화되어 있는지 확인
  const isActive = $derived(activeTab === name);
</script>

<!--
  SettingTab 컴포넌트 - 개별 탭 컨텐츠 컨테이너

  @example
  <SettingTab name="model" {activeTab}>
    <ModelCommonAttrButtons fileId="123" />
  </SettingTab>
-->

{#if isActive}
  <div
    class="h-full {className}"
    role="tabpanel"
    id="tabpanel-{name}"
    aria-labelledby="tab-{name}"
    tabindex="0"
  >
    <div class="space-y-2">
      {@render children?.()}
    </div>
  </div>
{/if}