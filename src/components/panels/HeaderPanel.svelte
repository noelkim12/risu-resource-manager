<script>
  import Button from '../ui/common/Button.svelte';
  import Badge from '../ui/common/Badge.svelte';
  import { FileText, Trash2, Menu, X } from 'lucide-svelte';

  /**
   * HeaderPanel 컴포넌트
   * @example
   * <HeaderPanel 
   *   stats={stats}
   *   activeTab={activeTab}
   *   leftPanelOpen={leftPanelOpen}
   *   filesLength={filesLength}
   * />
   */
  export let stats = { totalFiles: 0, totalSize: 0, types: {} };
  export let activeTab = 'risup';
  export let leftPanelOpen = true;
  export let filesLength = 0;

  function getModernTabGradient(tab) {
    switch (tab) {
      case 'risup': return 'from-blue-500 to-indigo-600';
      case 'risum': return 'from-green-500 to-emerald-600';
      case 'charx': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-slate-600';
    }
  }

  function getTabShadow(tab) {
    switch (tab) {
      case 'risup': return 'shadow-blue-500/25';
      case 'risum': return 'shadow-green-500/25';
      case 'charx': return 'shadow-purple-500/25';
      default: return 'shadow-gray-500/25';
    }
  }

  function getTypeGradient(type) {
    switch (type) {
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

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleTabChange(tab) {
    dispatch('tabChange', tab);
  }

  function handleToggleLeftPanel() {
    dispatch('toggleLeftPanel');
  }

  function handleClearAll() {
    dispatch('clearAll');
  }
</script>

<header class="backdrop-blur-xl bg-white/80 border-b border-white/20 flex-shrink-0 shadow-lg shadow-black/5">
  <div class="px-6 py-6">
    <!-- Top Row: Logo + Stats + Actions -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          class="lg:hidden p-2 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-sm shadow-lg shadow-black/10 transition-all duration-200 hover:shadow-xl hover:shadow-black/20"
          on:click={handleToggleLeftPanel}
        >
          {#if leftPanelOpen}
            <X class="h-5 w-5 text-gray-700" />
          {:else}
            <Menu class="h-5 w-5 text-gray-700" />
          {/if}
        </button>
        
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <FileText class="text-white h-8 w-8" />
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              RisuAI Resource Manager
            </h1>
            <p class="text-gray-600 text-sm font-medium">
              RisuAI 리소스 관리 도구
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Stats -->
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg shadow-black/5 border border-white/20">
            <span class="text-sm font-semibold text-gray-700">총 {stats.totalFiles}개 파일</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg shadow-black/5 border border-white/20">
            <span class="text-sm font-semibold text-gray-700">{formatFileSize(stats.totalSize)}</span>
          </div>
          {#each Object.entries(stats.types) as [type, count]}
            <div class="px-3 py-2 rounded-xl bg-gradient-to-r {getTypeGradient(type)} shadow-md shadow-black/10 border border-white/30">
              <span class="text-xs font-bold text-white">.{type}: {count}</span>
            </div>
          {/each}
        </div>

        {#if filesLength > 0}
          <button
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-200 flex items-center gap-2"
            on:click={handleClearAll}
          >
            <Trash2 class="h-4 w-4" />
            전체 삭제
          </button>
        {/if}
        
        <button
          class="hidden lg:flex p-2 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-sm shadow-lg shadow-black/10 transition-all duration-200 hover:shadow-xl hover:shadow-black/20"
          on:click={handleToggleLeftPanel}
        >
          {#if leftPanelOpen}
            <X class="h-5 w-5 text-gray-700" />
          {:else}
            <Menu class="h-5 w-5 text-gray-700" />
          {/if}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-1 p-1 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg shadow-black/5 border border-white/20">
      {#each ['risup', 'risum', 'charx'] as tab}
        <button
          type="button"
          class="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group {activeTab === tab 
            ? `bg-gradient-to-r ${getModernTabGradient(tab)} text-white shadow-lg ${getTabShadow(tab)}` 
            : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'}"
          on:click={() => handleTabChange(tab)}
        >
          <span class="relative z-10 flex items-center gap-2">
            .{tab}
            {#if stats.types[tab]}
              <span class="px-2 py-1 rounded-full bg-white/20 text-xs font-bold">
                {stats.types[tab]}
              </span>
            {/if}
          </span>
          {#if activeTab !== tab}
            <div class="absolute inset-0 bg-gradient-to-r {getModernTabGradient(tab)} opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</header>