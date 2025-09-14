<script>
	import { writable } from "svelte/store";
	import FileUploader from "./components/FileUploader.svelte";
	import FileList from "./components/FileList.svelte";
	import FileViewer from "./components/FileViewer.svelte";
	import Button from "./components/ui/Button.svelte";
	import Badge from "./components/ui/Badge.svelte";
	import AlertDialog from "./components/ui/AlertDialog.svelte";
	import { FileText, Trash2, Menu, X } from "lucide-svelte";

	// File store
	const files = writable([]);
	const selectedFileId = writable(null);
	
	// New state for tabs and panels
	const activeTab = writable('risup');
	const leftPanelOpen = writable(true);

	let showClearDialog = false;

	// Reactive declarations for computed values
	$: selectedFile = $files.find((file) => file.id === $selectedFileId) || null;
	$: stats = getFileStats($files);
	$: filteredFiles = $files.filter(file => file.type === $activeTab);

	function getFileStats(fileList) {
		const totalFiles = fileList.length;
		const totalSize = fileList.reduce((acc, file) => acc + file.size, 0);
		const types = fileList.reduce((acc, file) => {
			acc[file.type] = (acc[file.type] || 0) + 1;
			return acc;
		}, {});

		return { totalFiles, totalSize, types };
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}

	function handleFilesAdded(event) {
		const newFiles = event.detail;
		files.update((prev) => [...prev, ...newFiles]);

		// 새로 추가된 첫 번째 파일을 자동으로 선택
		if (newFiles.length > 0) {
			selectedFileId.set(newFiles[0].id);
		}
	}

	function handleFileSelect(event) {
		selectedFileId.set(event.detail);
	}

	function handleFileDelete(event) {
		const fileId = event.detail;
		files.update((prev) => prev.filter((file) => file.id !== fileId));

		// 삭제된 파일이 선택된 파일이었다면 선택 해제
		if ($selectedFileId === fileId) {
			selectedFileId.set(null);
		}
	}

	function handleFileUpdate(event) {
		const { fileId, newContent } = event.detail;
		files.update((prev) =>
			prev.map((file) =>
				file.id === fileId
					? { ...file, content: newContent, size: new Blob([newContent]).size }
					: file
			)
		);
	}

	function handleClearAll() {
		files.set([]);
		selectedFileId.set(null);
		showClearDialog = false;
	}

	function handleTabChange(tab) {
		activeTab.set(tab);
		// 현재 선택된 파일이 새 탭에 속하지 않으면 선택 해제
		if (selectedFile && selectedFile.type !== tab) {
			selectedFileId.set(null);
		}
	}

	function toggleLeftPanel() {
		leftPanelOpen.update(open => !open);
	}

	function getTabColor(tab) {
		switch (tab) {
			case 'risup': return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'risum': return 'bg-green-100 text-green-800 border-green-200';
			case 'charx': return 'bg-purple-100 text-purple-800 border-purple-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}
</script>

<div class="bg-background min-h-screen flex flex-col">
	<!-- Header -->
	<header class="bg-card border-b flex-shrink-0">
		<div class="px-4 py-4">
			<!-- Top Row: Logo + Stats + Actions -->
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center gap-3">
					<Button
						variant="ghost"
						size="sm"
						on:click={toggleLeftPanel}
						class="lg:hidden"
					>
						{#if $leftPanelOpen}
							<X class="h-4 w-4" />
						{:else}
							<Menu class="h-4 w-4" />
						{/if}
					</Button>
					
					<div class="bg-primary/10 rounded-lg p-2">
						<FileText class="text-primary h-6 w-6" />
					</div>
					<div>
						<h1 class="text-xl font-semibold">RisuAI File Manager</h1>
						<p class="text-muted-foreground text-sm">
							RisuAI 확장자 파일(.risup, .risum, .charx) 관리 도구
						</p>
					</div>
				</div>

				<div class="flex items-center gap-4">
					<!-- Stats -->
					<div class="flex items-center gap-2">
						<Badge variant="secondary">
							총 {stats.totalFiles}개 파일
						</Badge>
						<Badge variant="outline">
							{formatFileSize(stats.totalSize)}
						</Badge>
						{#each Object.entries(stats.types) as [type, count]}
							<Badge variant="outline" class="text-xs">
								.{type}: {count}
							</Badge>
						{/each}
					</div>

					{#if $files.length > 0}
						<Button
							variant="outline"
							size="sm"
							on:click={() => (showClearDialog = true)}
							class="flex items-center gap-2"
						>
							<Trash2 class="h-4 w-4" />
							전체 삭제
						</Button>
					{/if}
					
					<Button
						variant="ghost"
						size="sm"
						on:click={toggleLeftPanel}
						class="hidden lg:flex"
					>
						{#if $leftPanelOpen}
							<X class="h-4 w-4" />
						{:else}
							<Menu class="h-4 w-4" />
						{/if}
					</Button>
				</div>
			</div>

			<!-- Tabs -->
			<div class="flex items-center gap-2">
				{#each ['risup', 'risum', 'charx'] as tab}
					<button
						type="button"
						class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors {$activeTab === tab 
							? getTabColor(tab) 
							: 'bg-background text-muted-foreground hover:bg-accent'}"
						on:click={() => handleTabChange(tab)}
					>
						.{tab}
						{#if stats.types[tab]}
							<span class="ml-1 text-xs opacity-75">({stats.types[tab]})</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 flex overflow-hidden">
		<!-- Left Panel -->
		<div class="flex-shrink-0 transition-all duration-300 {$leftPanelOpen ? 'w-80' : 'w-0'} overflow-hidden border-r bg-card">
			<div class="w-80 h-full flex flex-col">
				<!-- Compact File Uploader -->
				<div class="p-4 border-b">
					<FileUploader compact={true} on:filesAdded={handleFilesAdded} />
				</div>
				
				<!-- File List -->
				<div class="flex-1 overflow-hidden">
					<FileList
						files={$filteredFiles}
						selectedFileId={$selectedFileId}
						on:fileSelect={handleFileSelect}
						on:fileDelete={handleFileDelete}
					/>
				</div>
			</div>
		</div>

		<!-- Center Panel -->
		<div class="flex-1 overflow-hidden">
			<FileViewer file={selectedFile} on:fileUpdate={handleFileUpdate} />
		</div>

		<!-- Right Panel -->
		<div class="w-80 flex-shrink-0 border-l bg-card hidden lg:block">
			<div class="p-4">
				<h3 class="text-lg font-semibold mb-4">유틸리티</h3>
				<div class="text-muted-foreground text-sm">
					향후 추가될 유틸리티 기능들이 여기에 표시됩니다.
				</div>
				
				{#if selectedFile}
					<div class="mt-6 space-y-3">
						<h4 class="font-medium">파일 정보</h4>
						<div class="text-sm space-y-2">
							<div><span class="text-muted-foreground">이름:</span> {selectedFile.name}</div>
							<div><span class="text-muted-foreground">타입:</span> .{selectedFile.type}</div>
							<div><span class="text-muted-foreground">크기:</span> {formatFileSize(selectedFile.size)}</div>
							<div><span class="text-muted-foreground">업로드:</span> {new Date(selectedFile.uploadedAt).toLocaleDateString('ko-KR')}</div>
							{#if selectedFile.parseError}
								<div class="text-red-600"><span class="text-muted-foreground">상태:</span> 파싱 오류</div>
							{:else if selectedFile.parsedContent}
								<div class="text-green-600"><span class="text-muted-foreground">상태:</span> 파싱 완료</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>

<!-- Clear All Dialog -->
<AlertDialog
	bind:open={showClearDialog}
	title="모든 파일 삭제"
	description="모든 파일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
	on:confirm={handleClearAll}
	on:cancel={() => (showClearDialog = false)}
/>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
	}

	:global(.bg-background) {
		background-color: hsl(var(--background, 0 0% 100%));
	}

	:global(.bg-card) {
		background-color: hsl(var(--card, 0 0% 100%));
	}

	:global(.border-b) {
		border-bottom: 1px solid hsl(var(--border, 220 13% 91%));
	}

	:global(.text-primary) {
		color: hsl(var(--primary, 220.9 39.3% 11%));
	}

	:global(.text-muted-foreground) {
		color: hsl(var(--muted-foreground, 220 8.9% 46.1%));
	}

	:global(.bg-primary\/10) {
		background-color: hsl(var(--primary, 220.9 39.3% 11%) / 0.1);
	}

	:global(.bg-accent) {
		background-color: hsl(var(--accent, 220 14.3% 95.9%));
	}

	.bg-blue-100 {
		background-color: rgb(219 234 254);
	}
	.text-blue-800 {
		color: rgb(30 64 175);
	}
	.border-blue-200 {
		border-color: rgb(191 219 254);
	}
	.bg-green-100 {
		background-color: rgb(220 252 231);
	}
	.text-green-800 {
		color: rgb(22 101 52);
	}
	.border-green-200 {
		border-color: rgb(187 247 208);
	}
	.bg-purple-100 {
		background-color: rgb(237 233 254);
	}
	.text-purple-800 {
		color: rgb(91 33 182);
	}
	.border-purple-200 {
		border-color: rgb(221 214 254);
	}
</style>
