<!--
  OpenRouter Settings용 ViewerButton 목록
  ModelOpenRouterSettingButtons.svelte에 추가할 코드
-->

<!-- OpenRouter Settings를 Accordion으로 그룹화 -->
<Accordion name="OpenRouter Settings" styled>

  <!-- OpenRouter Fallback -->
  <ViewerButton
    key="openrouterFallback"
    value={currentContent.openrouterFallback}
    {fileId}
    fileType="risup"
  />

  <!-- OpenRouter Middle Out -->
  <ViewerButton
    key="openrouterMiddleOut"
    value={currentContent.openrouterMiddleOut}
    {fileId}
    fileType="risup"
  />

  <!-- Use Instruct Prompt -->
  <ViewerButton
    key="useInstructPrompt"
    value={currentContent.useInstructPrompt}
    {fileId}
    fileType="risup"
  />

  <!-- Provider Selection -->
  <ViewerButton
    key="openrouterProvider"
    value={currentContent.openrouterProvider}
    {fileId}
    fileType="risup"
  />

  <!-- Chat Format Settings (useInstructPrompt가 true일 때만) -->
  {#if currentContent.useInstructPrompt}
    <!-- ChatFormatSettings 관련 필드들이 필요한 경우 여기에 추가 -->
    <!-- 예시: -->
    <!-- <ViewerButton
      key="chatFormat.systemPrefix"
      value={currentContent.chatFormat?.systemPrefix}
      {fileId}
      fileType="risup"
    /> -->
  {/if}

</Accordion>