<script>
	import { createEventDispatcher } from "svelte";
	import { Upload } from "lucide-svelte";
	import { importRisupFile } from "../lib/risup/index";
	import { risupTemplate } from "$lib/templates/risupTemplate";

	const dispatch = createEventDispatcher();

	export let compact = false;
	export let allowedTab = null; // 특정 탭이 지정되면 해당 확장자만 허용

	let isDragging = false;
	let fileInput;

	// allowedTab이 지정되면 해당 확장자만, 아니면 모든 확장자 허용
	$: allowedExtensions = allowedTab ? [allowedTab] : ["risup", "risum", "charx"];

	function handleDragEnter(e) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e) {
		e.preventDefault();
		if (!e.currentTarget.contains(e.relatedTarget)) {
			isDragging = false;
		}
	}

	function handleDragOver(e) {
		e.preventDefault();
	}

	function handleDrop(e) {
		e.preventDefault();
		isDragging = false;

		const files = Array.from(e.dataTransfer.files);
		processFiles(files);
	}

	function handleFileSelect(e) {
		const files = Array.from(e.target.files);
		processFiles(files);
		e.target.value = "";
	}

	function processFiles(files) {
		const validFiles = files.filter((file) => {
			const extension = file.name.split(".").pop().toLowerCase();
			return allowedExtensions.includes(extension);
		});

		if (validFiles.length === 0) {
			const extensionList = allowedExtensions.map(ext => `.${ext}`).join(", ");
			alert(`지원되지 않는 파일 형식입니다. ${extensionList} 파일만 업로드할 수 있습니다.`);
			return;
		}

		const processedFiles = validFiles.map((file) => ({
			id: crypto.randomUUID(),
			name: file.name,
			type: file.name.split(".").pop().toLowerCase(),
			size: file.size,
			uploadedAt: new Date(),
			content: "", // Will be read later
		}));

		// Read and parse file contents
		Promise.all(
			validFiles.map((file, index) => {
				return new Promise(async (resolve) => {
					try {
						let rawContent;
						let parsedContent;

						// Parse based on file type
						if (processedFiles[index].type === "risup") {
							console.log(`파싱 시작: ${file.name}, 크기: ${file.size} bytes`);

							try {
								parsedContent = await importRisupFile(file);
								console.log(`파싱 성공:`, parsedContent);
							} catch (parseError) {
								console.error(`importRisupFile 오류:`, parseError);
								throw new Error(`파싱 실패: ${parseError.message} (${parseError.name})`);
							}
						} else if (processedFiles[index].type === "risum") {
							console.log(`파싱 시작: ${file.name}, 크기: ${file.size} bytes`);
							// TODO: 추후 구현 예정
							parsedContent = { message: "risum 파싱 로직 추후 구현 예정" };
						} else if (processedFiles[index].type === "charx") {
							console.log(`파싱 시작: ${file.name}, 크기: ${file.size} bytes`);
							// TODO: 추후 구현 예정
							parsedContent = { message: "charx 파싱 로직 추후 구현 예정" };
						}
						else {
							// Read as text for other files
							rawContent = await new Promise((textResolve) => {
								const textReader = new FileReader();
								textReader.onload = (e) => textResolve(e.target.result);
								textReader.readAsText(file);
							});
							parsedContent = rawContent;
						}

						processedFiles[index].content = rawContent; // Keep original for download
						processedFiles[index].parsedContent = parsedContent; // Add parsed content
					} catch (error) {
						console.error(`파일 파싱 오류 (${file.name}):`, error);
						// Fallback: try to read as text
						try {
							const textReader = new FileReader();
							textReader.onload = (e) => {
								processedFiles[index].content = e.target.result;
								processedFiles[index].parsedContent = null;
								processedFiles[index].parseError =
									`${error.message || error.name || "Unknown error"}`;
								resolve();
							};
							textReader.readAsText(file);
							return;
						} catch (fallbackError) {
							processedFiles[index].content = null;
							processedFiles[index].parsedContent = null;
							processedFiles[index].parseError =
								`${error.message || error.name || "Unknown error"}`;
						}
					}
					resolve();
				});
			})
		).then(() => {
			dispatch("filesAdded", processedFiles);
		});
	}

	function openFileDialog() {
		fileInput.click();
	}
</script>

<div class="w-full">
	{#if compact}
		<!-- Compact Mode -->
		<button
			type="button"
			class="w-full rounded-lg border-2 border-dashed p-3 transition-colors {isDragging
				? 'border-primary bg-primary/5'
				: 'border-gray-300 hover:border-gray-400'} text-center"
			on:dragenter={handleDragEnter}
			on:dragleave={handleDragLeave}
			on:dragover={handleDragOver}
			on:drop={handleDrop}
			on:click={openFileDialog}
		>
			<input
				bind:this={fileInput}
				type="file"
				multiple
				accept={allowedExtensions.map(ext => `.${ext}`).join(",")}
				on:change={handleFileSelect}
				class="sr-only"
			/>

			<div class="flex items-center justify-center gap-2">
				<Upload class="h-4 w-4 text-gray-400" />
				<span class="text-muted-foreground text-sm font-medium">파일 업로드</span>
			</div>
			<div class="mt-1 text-xs text-gray-400">
				드래그 또는 클릭
				{#if allowedTab}
					<br/>.{allowedTab} 전용
				{/if}
			</div>
		</button>
	{:else}
		<!-- Full Mode -->
		<div
			role="button"
			tabindex="0"
			class="relative rounded-lg border-2 border-dashed p-6 transition-colors {isDragging
				? 'border-primary bg-primary/5'
				: 'border-gray-300 hover:border-gray-400'}"
			on:dragenter={handleDragEnter}
			on:dragleave={handleDragLeave}
			on:dragover={handleDragOver}
			on:drop={handleDrop}
			on:keydown={(e) => e.key === "Enter" && openFileDialog()}
		>
			<input
				bind:this={fileInput}
				type="file"
				multiple
				accept={allowedExtensions.map(ext => `.${ext}`).join(",")}
				on:change={handleFileSelect}
				class="sr-only"
			/>

			<div class="text-center">
				<Upload class="mx-auto mb-4 h-12 w-12 text-gray-400" />
				<div class="mb-2 text-lg font-medium">파일을 드래그하여 업로드하세요</div>
				<div class="mb-4 text-sm text-gray-500">
					또는
					<button
						type="button"
						class="text-primary font-medium hover:underline"
						on:click={openFileDialog}
					>
						파일 선택
					</button>
				</div>
				<div class="text-xs text-gray-400">
					지원 형식: {allowedExtensions.map(ext => `.${ext}`).join(", ")}
					{#if allowedTab}
						({allowedTab} 전용 모드)
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
