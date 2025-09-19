<script>
	import { FileText, X } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";
	import DefaultViewer from "../viewers/DefaultViewer.svelte";
	import RisupDetail from "../viewers/risup/RisupDetail.svelte";
	import { language } from "$lib/i18n";

	/**
	 * RightPanel 컴포넌트
	 *
	 * 파일의 상세 정보와 키-값 쌍을 표시하는 우측 패널
	 *
	 * @example
	 * <RightPanel
	 *   selectedFile={file}
	 *   selectedKey="name"
	 *   selectedValue="test"
	 *   isVisible={true}
	 *   on:close={handleClose}
	 * />
	 */

	export let selectedFile = null;
	export let selectedKey = null;
	export let selectedValue = null;
	export let isVisible = false;

	const dispatch = createEventDispatcher();

	function getModernTabGradient(tab) {
		switch (tab) {
			case "risup":
				return "from-blue-500 to-indigo-600";
			case "risum":
				return "from-green-500 to-emerald-600";
			case "charx":
				return "from-purple-500 to-violet-600";
			default:
				return "from-gray-500 to-slate-600";
		}
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}

	function handleClose() {
		dispatch("close");
	}

</script>

<div
	class="h-full rounded-2xl border border-white/20 bg-white/60 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-300 ease-in-out {isVisible
		? 'opacity-100'
		: 'pointer-events-none opacity-0'}"
>
	<div class="flex h-full flex-col p-6">
		<!-- Header -->
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div
					class="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-2 shadow-lg shadow-violet-500/25"
				>
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z"
						/>
					</svg>
				</div>
				<h3 class="text-lg font-bold text-gray-800">상세보기</h3>
			</div>
			{#if selectedKey}
				<button
					type="button"
					class="rounded-lg p-1 transition-colors hover:bg-gray-200"
					on:click={handleClose}
				>
					<X class="h-4 w-4 text-gray-600" />
				</button>
			{/if}
		</div>

		<div class="flex-1 space-y-4 overflow-hidden">
			{#if selectedKey && selectedValue !== null}
				<!-- Key-Value Display -->
				<div
					class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-lg shadow-black/5"
				>
					<div class="mb-4 flex items-center gap-3">
						<div
							class="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-md shadow-blue-500/25"
						>
							<svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
								/>
							</svg>
						</div>
						<h4 class="font-bold text-gray-800">키 정보</h4>
					</div>
					<div class="space-y-3">
						<div class="rounded-lg border border-blue-100 bg-white/70 p-3">
							<div class="mb-1 text-xs font-medium text-gray-500">키 이름</div>
							<div class="font-semibold break-all text-gray-800">{language[selectedKey]}</div>
						</div>
						<div class="rounded-lg border border-blue-100 bg-white/70 p-3">
							<div class="mb-1 text-xs font-medium text-gray-500">데이터 타입</div>
							<div class="font-semibold text-gray-800">{typeof selectedValue}</div>
						</div>
					</div>
				</div>

				<!-- Value Display -->
				<div
					class="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-slate-100 p-5 shadow-lg shadow-black/5"
				>
					<div class="mb-4 flex items-center gap-3">
						<div
							class="rounded-lg bg-gradient-to-br from-gray-500 to-slate-600 p-2 shadow-md shadow-gray-500/25"
						>
							<svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h4 class="font-bold text-gray-800">값</h4>
					</div>
					<div class="h-full overflow-y-auto">

						{#if selectedFile}
							{#if selectedFile?.type === "risup"}
								<RisupDetail {selectedFile} {selectedKey} {selectedValue} on:close={handleClose} />
							{:else if selectedFile?.type === "risum"}
								<DefaultViewer
									{selectedFile}
									{selectedKey}
									{selectedValue}
									on:close={handleClose}
								/>
							{:else if selectedFile?.type === "charx"}
								<DefaultViewer
									{selectedFile}
									{selectedKey}
									{selectedValue}
									on:close={handleClose}
								/>
							{/if}
						{/if}
					</div>
				</div>
			{:else}
				<!-- Default State -->
				<div
					class="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
				>
					<p class="text-sm font-medium text-gray-600">키를 선택하면 상세 정보가 표시됩니다.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
