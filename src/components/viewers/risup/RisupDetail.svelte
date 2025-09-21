<script lang="ts">
  import { currentRisupContent } from "../../../lib/stores/risup.store";
  import type { BotPreset } from "../../../types/risu/preset.types";
  import ModelCommonAttrForms from "./attribute/model/forms/ModelCommonAttrForms.svelte";
  import ModelOobaForms from "./attribute/model/forms/ModelOobaForms.svelte";
  import ModelOpenRouterForms from "./attribute/model/forms/ModelOpenRouterForms.svelte";
  import ModelNaiForms from "./attribute/model/forms/ModelNaiForms.svelte";

  /**
   * RisupDetail 컴포넌트
   * @example
   * <RisupDetail
   *   selectedKey={selectedKey}
   * />
   */
  export let selectedKey = null;

  // selection store에 현재 선택 상태 설정
  $: storeContent = $currentRisupContent;
  $: currentContent = (storeContent as BotPreset) || ({} as BotPreset);
</script>

<div>
  <ModelCommonAttrForms {selectedKey} />
  <ModelOobaForms {selectedKey} />
  <ModelOpenRouterForms {selectedKey} />
  <ModelNaiForms {selectedKey} />
</div>
