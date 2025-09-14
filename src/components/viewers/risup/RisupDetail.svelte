<script lang="ts">
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
</script>

<div>
    {#if selectedKey === '' }
    {/if}
</div>