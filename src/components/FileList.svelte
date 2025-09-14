<script>
	import { createEventDispatcher } from "svelte";
	import Button from "./ui/common/Button.svelte";
	import { FileText, Trash2 } from "lucide-svelte";

	export let files = [];
	export let selectedFileId = null;

	const dispatch = createEventDispatcher();

	function handleFileSelect(fileId) {
		dispatch("fileSelect", fileId);
	}

	function handleFileDelete(fileId, event) {
		event.stopPropagation();
		dispatch("fileDelete", fileId);
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}

	function formatDate(date) {
		return new Date(date).toLocaleString("ko-KR", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	function getFileTypeColor(type) {
		switch (type) {
			case "risup":
				return "bg-blue-100 text-blue-800";
			case "risum":
				return "bg-green-100 text-green-800";
			case "charx":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}
</script>

<div class="bg-card h-full">
	<div class="p-4">
		<h2 class="text-lg font-semibold">파일 목록</h2>
		<p class="text-muted-foreground text-sm">
			{files.length}개의 파일이 있습니다
		</p>
	</div>

	<div class="h-[calc(100vh-30rem)] overflow-auto">
		{#if files.length === 0}
			<div class="text-muted-foreground flex h-full flex-col items-center justify-center">
				<FileText class="mb-4 h-12 w-12 opacity-50" />
				<p class="text-sm">업로드된 파일이 없습니다</p>
			</div>
		{:else}
			<div class="space-y-1 p-2  ">
				{#each files as file (file.id)}
					<button
						type="button"
						class="group hover:bg-accent flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors w-full text-left {selectedFileId ===
						file.id
							? 'bg-accent border-primary border'
							: ''}"
						on:click={() => handleFileSelect(file.id)}
					>
						<div class="flex min-w-0 flex-1 items-center gap-3">
							<FileText class="text-muted-foreground h-5 w-5 flex-shrink-0" />
							<div class="min-w-0 flex-1">
								<div class="truncate text-sm font-medium" title={file.name}>
									{file.name}
								</div>
								<div class="mt-1 flex items-center gap-2">
									<span
										class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getFileTypeColor(
											file.type
										)}"
									>
										.{file.type}
									</span>
									<span class="text-muted-foreground text-xs">
										{formatFileSize(file.size)}
									</span>
								</div>
								<div class="text-muted-foreground mt-1 text-xs">
									{formatDate(file.uploadedAt)}
								</div>
							</div>
						</div>

						<Button
							variant="ghost"
							size="sm"
							class="opacity-0 transition-opacity group-hover:opacity-100"
							on:click={(event) => handleFileDelete(file.id, event)}
						>
							<Trash2 class="h-4 w-4" />
						</Button>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.bg-blue-100 {
		background-color: rgb(219 234 254);
	}
	.text-blue-800 {
		color: rgb(30 64 175);
	}
	.bg-green-100 {
		background-color: rgb(220 252 231);
	}
	.text-green-800 {
		color: rgb(22 101 52);
	}
	.bg-purple-100 {
		background-color: rgb(237 233 254);
	}
	.text-purple-800 {
		color: rgb(91 33 182);
	}
	.bg-gray-100 {
		background-color: rgb(243 244 246);
	}
	.text-gray-800 {
		color: rgb(31 41 55);
	}

	.border-gradient {
		border: 1px solid transparent;
		background: 
			linear-gradient(white, white) padding-box,
			linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.3)) border-box;
	}
</style>
