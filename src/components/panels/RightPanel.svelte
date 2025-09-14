<script>
  import { FileText, X } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  export let selectedFile = null;
  export let selectedKey = null;
  export let selectedValue = null;
  export let isVisible = false;

  const dispatch = createEventDispatcher();

  function getModernTabGradient(tab) {
    switch (tab) {
      case 'risup': return 'from-blue-500 to-indigo-600';
      case 'risum': return 'from-green-500 to-emerald-600';
      case 'charx': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-slate-600';
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function handleClose() {
    dispatch('close');
  }

  function formatValue(value) {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
</script>

<div class="h-full bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/20 transition-all duration-300 ease-in-out {isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
  <div class="p-6 h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800">상세보기</h3>
      </div>
      {#if selectedKey}
        <button
          type="button"
          class="p-1 rounded-lg hover:bg-gray-200 transition-colors"
          on:click={handleClose}
        >
          <X class="w-4 h-4 text-gray-600" />
        </button>
      {/if}
    </div>

    <div class="flex-1 overflow-hidden space-y-4">
      {#if selectedKey && selectedValue !== null}
        <!-- Key-Value Display -->
        <div class="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg shadow-black/5">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/25">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h4 class="font-bold text-gray-800">키 정보</h4>
          </div>
          <div class="space-y-3">
            <div class="p-3 rounded-lg bg-white/70 border border-blue-100">
              <div class="text-xs text-gray-500 font-medium mb-1">키 이름</div>
              <div class="font-semibold text-gray-800 break-all">{selectedKey}</div>
            </div>
            <div class="p-3 rounded-lg bg-white/70 border border-blue-100">
              <div class="text-xs text-gray-500 font-medium mb-1">데이터 타입</div>
              <div class="font-semibold text-gray-800">{typeof selectedValue}</div>
            </div>
          </div>
        </div>

        <!-- Value Display -->
        <div class="flex-1 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-slate-100 border border-gray-200 shadow-lg shadow-black/5 overflow-hidden">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-slate-600 shadow-md shadow-gray-500/25">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 class="font-bold text-gray-800">값</h4>
          </div>
          <div class="h-full overflow-y-auto">
            <pre class="text-xs text-gray-700 whitespace-pre-wrap break-all bg-white/50 p-3 rounded-lg border border-gray-100 overflow-y-scroll max-h-[calc(100vh-30rem)]">{formatValue(selectedValue)}</pre>
          </div>
        </div>
      {:else}
        <!-- Default State -->
        <div class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <p class="text-sm text-gray-600 font-medium">키를 선택하면 상세 정보가 표시됩니다.</p>
        </div>

        {#if selectedFile}
          <div class="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-slate-100 border border-gray-200 shadow-lg shadow-black/5">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25">
                <FileText class="w-4 h-4 text-white" />
              </div>
              <h4 class="font-bold text-gray-800">파일 정보</h4>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center p-2 rounded-lg bg-white/50">
                <span class="text-gray-600 font-medium">이름:</span>
                <span class="font-semibold text-gray-800 truncate ml-2">{selectedFile.name}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg bg-white/50">
                <span class="text-gray-600 font-medium">타입:</span>
                <span class="px-2 py-1 rounded-full bg-gradient-to-r {getModernTabGradient(selectedFile.type)} text-white font-bold text-xs">.{selectedFile.type}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg bg-white/50">
                <span class="text-gray-600 font-medium">크기:</span>
                <span class="font-semibold text-gray-800">{formatFileSize(selectedFile.size)}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg bg-white/50">
                <span class="text-gray-600 font-medium">업로드:</span>
                <span class="font-semibold text-gray-800">{new Date(selectedFile.uploadedAt).toLocaleDateString('ko-KR')}</span>
              </div>
              {#if selectedFile.parseError}
                <div class="flex justify-between items-center p-2 rounded-lg bg-red-50 border border-red-200">
                  <span class="text-gray-600 font-medium">상태:</span>
                  <span class="px-2 py-1 rounded-full bg-red-500 text-white font-bold text-xs">파싱 오류</span>
                </div>
              {:else if selectedFile.parsedContent}
                <div class="flex justify-between items-center p-2 rounded-lg bg-green-50 border border-green-200">
                  <span class="text-gray-600 font-medium">상태:</span>
                  <span class="px-2 py-1 rounded-full bg-green-500 text-white font-bold text-xs">파싱 완료</span>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>

