<script lang="ts">
	import { language } from "$lib/i18n/index";
	import Help from "./others/Help.svelte";

	let open = $state(false);
	interface Props {
		name?: string;
		styled?: boolean;
		help?: keyof typeof language.help | "";
		disabled?: boolean;
		children?: import("svelte").Snippet;
		className?: string;
	}

	let {
		name = "",
		styled = false,
		help = "",
		disabled = false,
		children,
		className = "",
	}: Props = $props();
</script>

{#if disabled}
	{@render children?.()}
{:else if styled}
	<div class="mt-2 flex flex-col">
		<button
			class="w-full text-left p-3 rounded-lg border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-800"
			class:bg-blue-50={open}
			class:border-blue-400={open}
			onclick={() => {
				open = !open;
			}}
		>
			<span class="mr-2 font-medium">{name}</span>
			{#if help}
				<Help key={help} />
			{/if}</button
		>
		{#if open}
			<div class={"flex flex-col rounded-b-lg border-2 border-gray-300 border-t-0 bg-white p-2 " + className}>
				{@render children?.()}
			</div>
		{/if}
	</div>
{:else}
	<div class="flex flex-col">
		<button
			class="mb-2 w-full text-left p-3 rounded-lg border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-800"
			class:bg-blue-50={open}
			class:mb-2={!open}
			class:border-blue-400={open}
			onclick={() => {
				open = !open;
			}}>{name}</button
		>
		{#if open}
			<div class="flex flex-col rounded-b-lg border-2 border-gray-300 border-t-0 bg-white p-2">
				{@render children?.()}
			</div>
		{/if}
	</div>
{/if}
