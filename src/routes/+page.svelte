<script>
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import HeaderPanel from "../components/panels/HeaderPanel.svelte";
  import LeftPanel from "../components/panels/LeftPanel.svelte";
  import CenterPanel from "../components/panels/CenterPanel.svelte";
  import RightPanel from "../components/panels/RightPanel.svelte";
  import AlertDialog from "../components/ui/common/AlertDialog.svelte";
  import JsonModal from "../components/ui/common/JsonModal.svelte";
  import { risuStorage, initializeStorage } from "$lib/storage";
  import { debounce } from "$lib/utils/debounce";
  import { selectionStore, currentSelection } from "../lib/stores/selection.store";
  import { jsonModalState, jsonModalStore } from "../lib/stores/jsonModal.store";

  // File store
  const files = writable([]);
  const selectedFileId = writable(null);

  // New state for tabs and panels
  const activeTab = writable("risup");
  const leftPanelOpen = writable(true);

  // Right panel state for key-value display
  const rightPanelVisible = writable(false);
  const selectedKey = writable(null);
  const selectedValue = writable(null);

  let showClearDialog = false;
  let isLoading = true;

  // Reactive declarations for computed values
  $: selectedFile = $files.find((file) => file.id === $selectedFileId) || null;
  $: stats = getFileStats($files);
  $: filteredFiles = $files.filter((file) => file.type === $activeTab);

  // selection store 변화 감지하여 rightPanel 자동 활성화
  $: if ($currentSelection.isComplete && $currentSelection.fieldKey) {
    rightPanelVisible.set(true);
    selectedKey.set($currentSelection.fieldKey);
    // selectedValue는 RightPanel에서 자체적으로 계산하므로 여기서는 설정하지 않음
  }

  // Debug logging
  $: if (selectedFile) {
    console.log("Selected file:", selectedFile.name, selectedFile.type);
  } else {
    console.log("No file selected");
  }

  function getFileStats(fileList) {
    const totalFiles = fileList.length;
    const totalSize = fileList.reduce((acc, file) => acc + file.size, 0);
    const types = fileList.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {});

    return { totalFiles, totalSize, types };
  }

  async function handleFilesAdded(event) {
    const newFiles = event.detail;
    files.update((prev) => [...prev, ...newFiles]);

    // 새로 추가된 파일들을 저장소에 저장
    for (const file of newFiles) {
      await saveFileToStorage(file);
    }

    // 새로 추가된 첫 번째 파일을 자동으로 선택
    if (newFiles.length > 0) {
      selectedFileId.set(newFiles[0].id);
      debouncedSaveState();
    }
  }

  function handleFileSelect(event) {
    selectedFileId.set(event.detail);
    // 새 파일 선택 시 Right Panel 닫기
    handleRightPanelClose();
    debouncedSaveState();
  }

  async function handleFileDelete(event) {
    const fileId = event.detail;
    files.update((prev) => prev.filter((file) => file.id !== fileId));

    // 저장소에서도 삭제
    try {
      await risuStorage.deleteFile(fileId);
    } catch (error) {
      console.warn("Failed to delete file from storage:", error);
    }

    // 삭제된 파일이 선택된 파일이었다면 선택 해제
    if ($selectedFileId === fileId) {
      selectedFileId.set(null);
      debouncedSaveState();
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

  async function handleClearAll() {
    files.set([]);
    selectedFileId.set(null);
    showClearDialog = false;

    // 저장소에서도 모든 데이터 삭제
    try {
      await risuStorage.clearAll();
    } catch (error) {
      console.warn("Failed to clear storage:", error);
    }
  }

  function handleTabChange(event) {
    activeTab.set(event.detail);
    // 현재 선택된 파일이 새 탭에 속하지 않으면 선택 해제
    if (selectedFile && selectedFile.type !== event.detail) {
      selectedFileId.set(null);
    }
    // 탭 변경 시 Right Panel 닫기
    handleRightPanelClose();
    debouncedSaveState();
  }

  function handleToggleLeftPanel() {
    leftPanelOpen.update((open) => !open);
    debouncedSaveState();
  }

  function handleKeySelect(event) {
    const { key, value } = event.detail;
    selectedKey.set(key);
    selectedValue.set(value);
    rightPanelVisible.set(true);
    debouncedSaveState();
  }

  function handleRightPanelClose() {
    rightPanelVisible.set(false);
    selectedKey.set(null);
    selectedValue.set(null);
    selectionStore.clearField(); // selection store의 fieldKey도 클리어
    debouncedSaveState();
  }

  async function handleValueUpdate(event) {
    const { key, value } = event.detail;

    // 현재 선택된 파일의 parsedContent 업데이트
    if (selectedFile && selectedFile.parsedContent) {
      let updatedFile;

      files.update((prev) =>
        prev.map((file) => {
          if (file.id === selectedFile.id) {
            // 중첩된 키 경로 처리 (예: "data.settings.aiModel")
            const keyPath = key.split(".");
            const updatedContent = { ...file.parsedContent };

            let current = updatedContent;
            for (let i = 0; i < keyPath.length - 1; i++) {
              if (!current[keyPath[i]]) current[keyPath[i]] = {};
              current = current[keyPath[i]];
            }
            current[keyPath[keyPath.length - 1]] = value;

            updatedFile = {
              ...file,
              parsedContent: updatedContent,
            };
            return updatedFile;
          }
          return file;
        })
      );

      // selectedValue도 업데이트
      selectedValue.set(value);

      // 저장소에 parsedContent 변경사항 저장
      if (updatedFile) {
        try {
          await risuStorage.saveParsedContent(updatedFile.id, updatedFile.parsedContent);
        } catch (error) {
          console.warn("Failed to save updated parsedContent to storage:", error);
        }
      }

      // 앱 상태 저장
      debouncedSaveState();
    }
  }

  // 디바운싱된 상태 저장 함수
  const debouncedSaveState = debounce(async () => {
    try {
      await risuStorage.saveAppState({
        selectedFileId: $selectedFileId,
        activeTab: $activeTab,
        leftPanelOpen: $leftPanelOpen,
        rightPanelVisible: $rightPanelVisible,
        selectedKey: $selectedKey,
        selectedValue: $selectedValue,
      });
    } catch (error) {
      console.warn("Failed to save app state:", error);
    }
  }, 500);

  // 파일을 저장소에 저장
  async function saveFileToStorage(file) {
    try {
      const storedFile = {
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: file.uploadedAt.toISOString(),
        parseError: file.parseError,
      };

      await risuStorage.saveFile(storedFile);

      if (file.parsedContent) {
        await risuStorage.saveParsedContent(file.id, file.parsedContent);
      }
    } catch (error) {
      console.warn("Failed to save file to storage:", error);
    }
  }

  // 저장소에서 파일 로드
  async function loadFilesFromStorage() {
    try {
      const storedFiles = await risuStorage.getAllFiles();
      const loadedFiles = [];

      for (const storedFile of storedFiles) {
        const parsedContent = await risuStorage.getParsedContent(storedFile.id);

        const file = {
          id: storedFile.id,
          name: storedFile.name,
          type: storedFile.type,
          size: storedFile.size,
          uploadedAt: new Date(storedFile.uploadedAt),
          content: "", // 원본 content는 저장하지 않음
          parsedContent,
          parseError: storedFile.parseError,
        };

        loadedFiles.push(file);
      }

      files.set(loadedFiles);
      return loadedFiles;
    } catch (error) {
      console.warn("Failed to load files from storage:", error);
      return [];
    }
  }

  // 앱 상태 로드
  async function loadAppState() {
    try {
      const state = await risuStorage.getAppState();

      selectedFileId.set(state.selectedFileId);
      activeTab.set(state.activeTab);
      leftPanelOpen.set(state.leftPanelOpen);
      rightPanelVisible.set(state.rightPanelVisible);
      selectedKey.set(state.selectedKey);
      selectedValue.set(state.selectedValue);
    } catch (error) {
      console.warn("Failed to load app state:", error);
    }
  }

  // 앱 초기화
  onMount(async () => {
    try {
      await initializeStorage();
      await loadFilesFromStorage();
      await loadAppState();
    } catch (error) {
      console.error("Failed to initialize app:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>RisuAI Resource Manager</title>
  <meta name="description" content="RisuAI 리소스(.risup, .risum, .charx) 관리 도구" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
  {#if isLoading}
    <!-- Loading State -->
    <div class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div
          class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"
        ></div>
        <div class="text-gray-600">데이터를 불러오는 중...</div>
      </div>
    </div>
  {:else}
    <!-- Header -->
    <HeaderPanel
      {stats}
      activeTab={$activeTab}
      leftPanelOpen={$leftPanelOpen}
      filesLength={$files.length}
      on:tabChange={handleTabChange}
      on:toggleLeftPanel={handleToggleLeftPanel}
      on:clearAll={() => (showClearDialog = true)}
    />

    <!-- Main Content -->
    <main class="flex min-h-0 flex-1 gap-6 p-6">
      <!-- Left Panel (20% when right panel visible, flexible when not) -->
      <div
        class="{$rightPanelVisible
          ? 'w-1/5'
          : 'flex-none'} sticky top-6 max-h-[calc(100vh-8rem)] self-start overflow-hidden transition-all duration-300"
      >
        <LeftPanel
          leftPanelOpen={$leftPanelOpen}
          {filteredFiles}
          selectedFileId={$selectedFileId}
          activeTab={$activeTab}
          on:filesAdded={handleFilesAdded}
          on:fileSelect={handleFileSelect}
          on:fileDelete={handleFileDelete}
        />
      </div>

      <!-- Center Panel (20% when right panel visible, flexible when not) -->
      <div class="{$rightPanelVisible ? 'w-1/5' : 'flex-1'} min-w-0 transition-all duration-300">
        <CenterPanel {selectedFile} on:keySelect={handleKeySelect} />
      </div>

      <!-- Right Panel (60% when visible, hidden when not) -->
      <div
        class="{$rightPanelVisible
          ? 'w-3/5'
          : 'w-0'} sticky top-6 h-[calc(100vh-4rem)] self-start overflow-hidden transition-all duration-300"
      >
        <RightPanel
          files={$files}
          isVisible={$rightPanelVisible}
          on:close={handleRightPanelClose}
          on:valueUpdate={handleValueUpdate}
        />
      </div>
    </main>
  {/if}
</div>

<!-- Clear All Dialog -->
<AlertDialog
  bind:open={showClearDialog}
  title="모든 파일 삭제"
  description="모든 파일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
  on:confirm={handleClearAll}
  on:cancel={() => (showClearDialog = false)}
/>

<!-- Global JSON Modal -->
<JsonModal
  isOpen={$jsonModalState.isOpen}
  title={$jsonModalState.title}
  jsonData={$jsonModalState.jsonData}
  onClose={jsonModalStore.close}
/>
