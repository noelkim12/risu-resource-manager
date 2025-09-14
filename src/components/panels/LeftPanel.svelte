<script>
	import FileUploader from "../FileUploader.svelte";
	import FileList from "../FileList.svelte";
	import { createEventDispatcher } from "svelte";

	/**
	 * LeftPanel 컴포넌트
	 * @example
	 * <LeftPanel
	 *   leftPanelOpen={leftPanelOpen}
	 *   filteredFiles={filteredFiles}
	 *   selectedFileId={selectedFileId}
	 *   activeTab={activeTab}
	 * />
	 */
	export let leftPanelOpen = true;
	export let filteredFiles = [];
	export let selectedFileId = null;
	export let activeTab = "risup";

	const dispatch = createEventDispatcher();

	function handleFilesAdded(event) {
		dispatch("filesAdded", event.detail);
	}

	function handleFileSelect(event) {
		dispatch("fileSelect", event.detail);
	}

	function handleFileDelete(event) {
		dispatch("fileDelete", event.detail);
	}
</script>

<div
	class="flex-shrink-0 transition-all duration-500 ease-in-out 
    {leftPanelOpen
		? 'w-80 opacity-100'
		: 'w-0 opacity-0'} overflow-hidden"
>
	<div
		class="border-gradient flex h-full w-80 flex-col rounded-2xl border bg-gradient-to-br from-white/70 via-white/60 to-white/50 shadow-xl shadow-indigo-500/10 backdrop-blur-xl"
	>
		<!-- Compact File Uploader -->
		<div class="border-gradient-light border-b p-6">
			<FileUploader compact={true} allowedTab={activeTab} on:filesAdded={handleFilesAdded} />
		</div>

		<!-- File List -->
		<div class="flex-1 overflow-hidden">
			<FileList
				files={filteredFiles}
				{selectedFileId}
				on:fileSelect={handleFileSelect}
				on:fileDelete={handleFileDelete}
			/>
		</div>
	</div>
</div>

<style>
	.border-gradient {
		border: 1px solid transparent;
		background:
			linear-gradient(white, white) padding-box,
			linear-gradient(
					135deg,
					rgba(99, 102, 241, 0.3),
					rgba(168, 85, 247, 0.2),
					rgba(59, 130, 246, 0.3)
				)
				border-box;
	}

	.border-gradient-light {
		border-bottom: 1px solid transparent;
		background:
			linear-gradient(white, white) padding-box,
			linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.15)) border-box;
	}
</style>
