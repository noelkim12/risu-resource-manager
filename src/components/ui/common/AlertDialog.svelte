<script>
	import { createEventDispatcher } from "svelte";
	import Button from "./Button.svelte";

	export let open = false;
	export let title = "";
	export let description = "";

	const dispatch = createEventDispatcher();

	function handleConfirm() {
		dispatch("confirm");
	}

	function handleCancel() {
		dispatch("cancel");
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			handleCancel();
		}
	}
</script>

{#if open}
	<div
		class="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm"
		role="dialog"
		tabindex="-1"
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === "Escape" && handleCancel()}
	>
		<div
			class="bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200"
		>
			<div class="flex flex-col space-y-2 text-center sm:text-left">
				<h2 class="text-lg font-semibold">{title}</h2>
				<p class="text-muted-foreground text-sm">{description}</p>
			</div>
			<div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
				<Button variant="outline" on:click={handleCancel}>취소</Button>
				<Button variant="destructive" on:click={handleConfirm}>모두 삭제</Button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.backdrop-blur-sm) {
		backdrop-filter: blur(4px);
	}
</style>
