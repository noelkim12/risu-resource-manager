<script>
  import RisupViewer from '../viewers/RisupViewer.svelte';
  import RisumViewer from '../viewers/RisumViewer.svelte';
  import CharxViewer from '../viewers/CharxViewer.svelte';
  import { createEventDispatcher } from 'svelte';

  export let selectedFile = null;

  const dispatch = createEventDispatcher();

  function handleKeySelect(event) {
    dispatch('keySelect', event.detail);
  }
</script>

<div class="flex-1 overflow-hidden bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-500/10 border border-gradient">
  {#if !selectedFile}
    <div class="h-full flex items-center justify-center">
      <div class="text-center p-8">
        <div class="text-gray-400 text-lg mb-2">파일을 선택하세요</div>
        <div class="text-gray-500 text-sm">왼쪽 패널에서 파일을 선택하여 내용을 확인할 수 있습니다.</div>
      </div>
    </div>
  {:else if selectedFile.type === 'risup'}
    <RisupViewer
      parsedContent={selectedFile.parsedContent}
      parseError={selectedFile.parseError}
      on:keySelect={handleKeySelect}
    />
  {:else if selectedFile.type === 'risum'}
    <RisumViewer
      parsedContent={selectedFile.parsedContent}
      parseError={selectedFile.parseError}
      on:keySelect={handleKeySelect}
    />
  {:else if selectedFile.type === 'charx'}
    <CharxViewer
      parsedContent={selectedFile.parsedContent}
      parseError={selectedFile.parseError}
      on:keySelect={handleKeySelect}
    />
  {:else}
    <div class="h-full flex items-center justify-center">
      <div class="text-center p-8">
        <div class="text-red-500 text-lg mb-2">지원되지 않는 파일 형식</div>
        <div class="text-gray-500 text-sm">이 파일 형식은 현재 지원되지 않습니다.</div>
      </div>
    </div>
  {/if}
</div>

<style>
  .border-gradient {
    border: 1px solid transparent;
    background: 
      linear-gradient(white, white) padding-box,
      linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.3)) border-box;
  }
</style>