<script lang="ts">
	import ModelList from "../../ui/risup/ModelList.svelte";

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
	export let selectedValue = null;
	
	function formatValue(value) {
		if (typeof value === "object" && value !== null) {
			return JSON.stringify(value, null, 2);
		}
		return String(value);
	}
</script>

<div>
    {#if selectedKey === 'aiModel' }
		<ModelList bind:value={selectedValue}/>
	{:else }
		<pre
		class="max-h-[calc(100vh-30rem)] overflow-y-scroll rounded-lg border border-gray-100 bg-white/50 p-3 text-xs break-all whitespace-pre-wrap text-gray-700">{formatValue(
			selectedValue
		)}</pre>
    {/if}
	
</div>