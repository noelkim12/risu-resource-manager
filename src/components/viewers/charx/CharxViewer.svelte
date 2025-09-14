<script>
	import { createEventDispatcher } from "svelte";
	import { ChevronRight } from "lucide-svelte";

	const dispatch = createEventDispatcher();

	export let parsedContent = null;
	export let parseError = null;

	$: keys = parsedContent ? Object.keys(parsedContent) : [];

	function handleKeyClick(key, value) {
		dispatch("keySelect", { key, value });
	}
</script>

<div class="h-full flex flex-col">
	{#if parseError}
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center p-6">
				<div class="text-red-500 font-semibold mb-2">파싱 오류</div>
				<div class="text-gray-600 text-sm">{parseError}</div>
			</div>
		</div>
	{:else if !parsedContent}
		<div class="flex-1 flex items-center justify-center">
			<div class="text-gray-500">파일을 선택하세요</div>
		</div>
	{:else}
		<div class="flex-1 overflow-hidden">
			<div class="h-full overflow-y-auto p-4">
				<div class="mb-4">
					<h3 class="text-lg font-semibold text-gray-800 mb-2">CHARX 파일 키 목록</h3>
					<div class="text-sm text-gray-600">{keys.length}개의 키</div>
				</div>

				<div class="space-y-2">
					{#each keys as key}
						<button
							type="button"
							class="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
							on:click={() => handleKeyClick(key, parsedContent[key])}
						>
							<div class="flex items-center justify-between">
								<div class="flex-1">
									<div class="font-medium text-gray-800">{key}</div>
									<div class="text-sm text-gray-500 mt-1">
										{typeof parsedContent[key] === 'object'
											? `객체 (${Object.keys(parsedContent[key]).length}개 속성)`
											: typeof parsedContent[key] === 'string'
											? parsedContent[key].length > 50
												? parsedContent[key].substring(0, 50) + '...'
												: parsedContent[key]
											: String(parsedContent[key])
										}
									</div>
								</div>
								<ChevronRight class="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>