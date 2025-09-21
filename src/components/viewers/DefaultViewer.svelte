<script>
  import { FileText, X } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import { language } from "$lib/i18n";

  /**
   * DefaultViewer 컴포넌트
   * @example
   * <DefaultViewer
   *   selectedKey={selectedKey}
   * />
   */
  export let selectedKey = null;

  console.log(language);
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

  function formatValue(value) {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
</script>

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
        <pre
          class="max-h-[calc(100vh-30rem)] overflow-y-scroll rounded-lg border border-gray-100 bg-white/50 p-3 text-xs break-all whitespace-pre-wrap text-gray-700">{formatValue(
            selectedValue
          )}</pre>
      </div>
    </div>
  {:else}
    <!-- Default State -->
    <div class="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <p class="text-sm font-medium text-gray-600">키를 선택하면 상세 정보가 표시됩니다.</p>
    </div>

    {#if selectedFile}
      <div
        class="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-slate-100 p-5 shadow-lg shadow-black/5"
      >
        <div class="mb-4 flex items-center gap-3">
          <div
            class="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-md shadow-emerald-500/25"
          >
            <FileText class="h-4 w-4 text-white" />
          </div>
          <h4 class="font-bold text-gray-800">파일 정보</h4>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex items-center justify-between rounded-lg bg-white/50 p-2">
            <span class="font-medium text-gray-600">이름:</span>
            <span class="ml-2 truncate font-semibold text-gray-800">{selectedFile.name}</span>
          </div>
          <div class="flex items-center justify-between rounded-lg bg-white/50 p-2">
            <span class="font-medium text-gray-600">타입:</span>
            <span
              class="rounded-full bg-gradient-to-r px-2 py-1 {getModernTabGradient(
                selectedFile.type
              )} text-xs font-bold text-white">.{selectedFile.type}</span
            >
          </div>
          <div class="flex items-center justify-between rounded-lg bg-white/50 p-2">
            <span class="font-medium text-gray-600">크기:</span>
            <span class="font-semibold text-gray-800">{formatFileSize(selectedFile.size)}</span>
          </div>
          <div class="flex items-center justify-between rounded-lg bg-white/50 p-2">
            <span class="font-medium text-gray-600">업로드:</span>
            <span class="font-semibold text-gray-800"
              >{new Date(selectedFile.uploadedAt).toLocaleDateString("ko-KR")}</span
            >
          </div>
          {#if selectedFile.parseError}
            <div
              class="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-2"
            >
              <span class="font-medium text-gray-600">상태:</span>
              <span class="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white"
                >파싱 오류</span
              >
            </div>
          {:else if selectedFile.parsedContent}
            <div
              class="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-2"
            >
              <span class="font-medium text-gray-600">상태:</span>
              <span class="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white"
                >파싱 완료</span
              >
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/if}
</div>
