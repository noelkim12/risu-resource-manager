<script>
	import { createEventDispatcher } from "svelte";
	import { ChevronRight } from "lucide-svelte";
	import { language } from "$lib/i18n";
	import ModelList from "../../ui/risup/ModelList.svelte";
	import Help from "../../ui/common/others/Help.svelte";
	import { getModelInfo, LLMFlags, LLMFormat, LLMProvider } from "$lib/utils/modelList";

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

	export let parsedContent = null;
	export let parseError = null;

	$: keys = parsedContent ? Object.keys(parsedContent) : [];

	function handleKeyClick(key, value) {
		dispatch("keySelect", { key, value });
	}

	const allowedKeys = [
		"name",
		"aiModel",
		"subModel",
		"maxContext",
		"maxResponse",
		"temperature",
		"frequencyPenalty",
		"maxContext",
		"maxResponse",
		"thinkingTokens",
	];
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
				<div class="mb-4">
					<h3 class="mb-2 text-lg font-semibold text-gray-800">RISUP 파일 키 목록</h3>
					<div class="text-sm text-gray-600">{keys.length}개의 키</div>
				</div>

				<div class="space-y-2">
					{#each keys as key}
						<button
							type="button"
							class="group w-full rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
							on:click={() => handleKeyClick(key, parsedContent[key])}
						>
							<div class="flex items-center justify-between">
								<div class="flex-1">
									<div class="font-medium text-gray-800">{language[key]}({key})</div>
									<div class="mt-1 text-sm text-gray-500">
										{parsedContent[key] === null
											? "null"
											: parsedContent[key] === undefined
												? "undefined"
												: typeof parsedContent[key] === "object"
													? `객체 (${Object.keys(parsedContent[key]).length}개 속성)`
													: typeof parsedContent[key] === "string"
														? parsedContent[key].length > 50
															? parsedContent[key].substring(0, 50) + "..."
															: parsedContent[key]
														: String(parsedContent[key])}
									</div>
								</div>
								<ChevronRight
									class="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500"
								/>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
