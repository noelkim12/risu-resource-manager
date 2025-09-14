<script>
  import { createEventDispatcher } from 'svelte';
  import Button from './ui/Button.svelte';
  import { FileText, Save, Edit3, Eye } from 'lucide-svelte';
  
  export let file = null;
  
  const dispatch = createEventDispatcher();
  
  let isEditing = false;
  let editContent = '';
  
  $: if (file && !isEditing) {
    editContent = file.content;
  }
  
  function toggleEdit() {
    if (isEditing) {
      // Save changes
      dispatch('fileUpdate', {
        fileId: file.id,
        newContent: file.parsedContent
      });
    } else {
      // Start editing
      editContent = file.parsedContent;
    }
    isEditing = !isEditing;
  }
  
  function formatDate(date) {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function getFileTypeColor(type) {
    switch (type) {
      case 'risup':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'risum':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'charx':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
</script>

<div class="h-full border-gradient rounded-lg bg-card flex flex-col">
  {#if !file}
    <div class="flex flex-col items-center justify-center h-full text-muted-foreground">
      <FileText class="w-16 h-16 mb-4 opacity-50" />
      <p class="text-lg font-medium mb-2">파일을 선택해주세요</p>
      <p class="text-sm">왼쪽에서 파일을 선택하여 내용을 확인하세요</p>
    </div>
  {:else}
    <!-- Header -->
    <div class="p-4 border-b">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <FileText class="w-6 h-6 text-muted-foreground" />
          <div>
            <h2 class="text-lg font-semibold truncate" title={file.name}>
              {file.name}
            </h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border {getFileTypeColor(file.type)}">
                .{file.type}
              </span>
              <span class="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
              <span class="text-sm text-muted-foreground">
                {formatDate(file.uploadedAt)}
              </span>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          on:click={toggleEdit}
          class="flex items-center gap-2"
        >
          {#if isEditing}
            <Save class="w-4 h-4" />
            저장
          {:else}
            <Edit3 class="w-4 h-4" />
            편집
          {/if}
        </Button>
      </div>
    </div>
    
    <!-- Content -->
    <div class="flex-1 overflow-hidden">
      {#if isEditing}
        <div class="h-full p-4">
          <textarea
            bind:value={editContent}
            placeholder="파일 내용을 입력하세요..."
            class="w-full h-full resize-none border rounded-md p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
      {:else}
        <div class="h-full overflow-auto p-4">
          {#if file.parseError}
            <div class="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-red-600 font-medium">⚠️ 파싱 오류</span>
              </div>
              <p class="text-sm text-red-700 mb-3">{file.parseError}</p>
              <p class="text-xs text-red-600">원본 파일 내용을 표시할 수 없습니다 (바이너리 파일)</p>
            </div>
          {:else if file.parsedContent && file.type === 'risup'}
            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <span class="text-blue-700 font-medium text-sm">📄 파싱된 내용 (.risup)</span>
              </div>
              <pre class="font-mono text-sm whitespace-pre-wrap break-words bg-muted p-4 rounded-lg border">{JSON.stringify(file.parsedContent, null, 2)}</pre>
            </div>
          {:else if file.content && typeof file.content === 'string' && file.content.trim()}
            <pre class="font-mono text-sm whitespace-pre-wrap break-words bg-muted p-4 rounded-lg">{file.content}</pre>
          {:else if file.content instanceof Uint8Array}
            <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-gray-600 font-medium">📦 바이너리 파일</span>
              </div>
              <p class="text-sm text-gray-700">파일 크기: {file.content.length} bytes</p>
              <p class="text-xs text-gray-600 mt-2">바이너리 파일은 텍스트로 표시할 수 없습니다.</p>
            </div>
          {:else}
            <div class="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Eye class="w-12 h-12 mb-4 opacity-50" />
              <p class="text-lg font-medium mb-2">파일이 비어있습니다</p>
              <p class="text-sm">편집 버튼을 클릭하여 내용을 추가하세요</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
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
  .bg-gray-100 {
    background-color: rgb(243 244 246);
  }
  .text-gray-800 {
    color: rgb(31 41 55);
  }
  .border-gray-200 {
    border-color: rgb(229 231 235);
  }
  .bg-muted {
    background-color: hsl(var(--muted, 220 14.3% 95.9%));
  }

  .border-gradient {
    border: 1px solid transparent;
    background: 
      linear-gradient(white, white) padding-box,
      linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.3)) border-box;
  }
</style>