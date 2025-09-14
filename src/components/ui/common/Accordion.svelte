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
			class="hover:bg-selected border-selected rounded-t-md border px-6 py-2 text-lg"
			class:bg-selected={open}
			class:rounded-b-md={!open}
			onclick={() => {
				open = !open;
			}}
		>
			<span class="mr-2">{name}</span>
			{#if help}
				<Help key={help} />
			{/if}</button
		>
		{#if open}
			<div class={"border-selected flex flex-col rounded-b-md border p-2 " + className}>
				{@render children?.()}
			</div>
		{/if}
	</div>
{:else}
	<div class="flex flex-col">
		<button
			class="hover:bg-selected px-6 py-2 text-lg"
			class:bg-selected={open}
			onclick={() => {
				open = !open;
			}}>{name}</button
		>
		{#if open}
			<div class="bg-darkbg flex flex-col">
				{@render children?.()}
			</div>
		{/if}
	</div>
{/if}
