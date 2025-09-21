<script lang="ts">
  import { Copy, X } from "lucide-svelte";
  import { onMount, onDestroy } from "svelte";

  /**
   * JsonModal 컴포넌트
   * @example
   * <JsonModal
   *   isOpen={isOpen}
   *   title={title}
   *   jsonData={jsonData}
   *   onClose={onClose}
   * />
   */
  interface Props {
    isOpen?: boolean;
    title?: string;
    jsonData?: any;
    onClose?: () => void;
  }

  let { isOpen = false, title = "JSON 보기", jsonData = null, onClose }: Props = $props();

  let jsonEditorContainer: HTMLDivElement;
  let jsonEditor: any = null;
  let JSONEditor: any = null;

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      onClose?.();
    }
  }

  async function copyToClipboard() {
    if (jsonData) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
        // TODO: 추후 toast 알림 시스템 추가 시 성공 메시지 표시
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  }

  onMount(async () => {
    try {
      // 브라우저에서만 JSONEditor 동적 import
      const module = await import("jsoneditor");
      JSONEditor = module.default;

      if (jsonEditorContainer && jsonData && JSONEditor) {
        initJsonEditor();
      }
    } catch (error) {
      console.error("Failed to load JSONEditor:", error);
    }
  });

  onDestroy(() => {
    if (jsonEditor) {
      jsonEditor.destroy();
      jsonEditor = null;
    }
  });

  function initJsonEditor() {
    console.log("initJsonEditor");
    if (!JSONEditor) {
      console.log("JSONEditor not loaded");
      return;
    }

    if (jsonEditor) {
      jsonEditor.destroy();
    }

    const options = {
      mode: "tree",
      readOnly: true,
      search: true,
      navigationBar: false,
      statusBar: false,
      mainMenuBar: false,
      expandAll: false,
      onError: (error: Error) => {
        console.error("JSONEditor error:", error);
      },
    };

    try {
      jsonEditor = new JSONEditor(jsonEditorContainer, options);
      console.log(jsonData);
      jsonEditor.set(jsonData);
      jsonEditor.expandAll();
    } catch (error) {
      console.error("Failed to initialize JSONEditor:", error);
    }
  }

  $effect(() => {
    if (isOpen && jsonEditorContainer && jsonData) {
      initJsonEditor();
    } else if (jsonEditor && jsonData) {
      jsonEditor.set(jsonData);
    }
  });
</script>

<!-- JSON 모달 -->
{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="json-modal-title"
    tabindex="-1"
  >
    <div
      class="relative h-[80vh] w-full max-w-4xl rounded-xl bg-white shadow-2xl dark:bg-gray-800"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="button"
      tabindex="0"
    >
      <!-- 모달 헤더 -->
      <div
        class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-600"
      >
        <h2 id="json-modal-title" class="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={copyToClipboard}
            class="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 transition-colors duration-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
            title="클립보드에 복사"
            aria-label="JSON을 클립보드에 복사"
          >
            <Copy class="h-4 w-4" />
            복사
          </button>
          <button
            type="button"
            onclick={onClose}
            class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            aria-label="모달 닫기"
          >
            <X class="h-4 w-4" />
            닫기
          </button>
        </div>
      </div>

      <!-- JSON 내용 -->
      <div class="h-[calc(100%-80px)] overflow-hidden p-6">
        {#if jsonData}
          <div
            bind:this={jsonEditorContainer}
            class="h-full w-full rounded-lg border border-gray-200 dark:border-gray-600"
            aria-label="JSON 트리 뷰어"
          ></div>
        {:else}
          <div class="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
            표시할 JSON 데이터가 없습니다.
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.jsoneditor) {
    border: none !important;
    height: 100% !important;
  }

  :global(.jsoneditor-outer) {
    height: 100% !important;
  }

  :global(.jsoneditor-main) {
    height: 100% !important;
  }

  :global(.jsoneditor-tree) {
    height: 100% !important;
    overflow: auto !important;
  }

  /* 다크모드 스타일 */
  :global(.dark .jsoneditor) {
    background-color: #1f2937 !important;
    color: #f9fafb !important;
  }

  :global(.dark .jsoneditor-tree) {
    background-color: #1f2937 !important;
    color: #f9fafb !important;
  }

  :global(.dark .jsoneditor-field) {
    color: #06b6d4 !important;
  }

  :global(.dark .jsoneditor-value) {
    color: #10b981 !important;
  }

  :global(.dark .jsoneditor-string) {
    color: #10b981 !important;
  }

  :global(.dark .jsoneditor-number) {
    color: #f59e0b !important;
  }

  :global(.dark .jsoneditor-boolean) {
    color: #3b82f6 !important;
  }

  :global(.dark .jsoneditor-null) {
    color: #9ca3af !important;
  }
</style>
