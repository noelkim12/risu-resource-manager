<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { cn, getInputStyles } from "../../../../lib/styles/component-utils";
  import type { InputVariant, InputSize } from "../../../../lib/styles/tokens";
  import { risupStore } from "../../../../lib/stores/risup.store";
  import { currentSelection } from "../../../../lib/stores/selection.store";
  import type { BotPreset } from "../../../../types/risu/preset.types";

  // 기존 기능 imports (상대경로로 변경 불가 - 외부 의존성)
  import { AllCBS, getNewHighlightId, highlighter, removeHighlight } from "../highlight";
  import { sleep } from "../../../../lib/utils/util";
  import { disableHighlight } from "../../../../lib/stores/stores.svelte";

  type FormEventHandler<T extends EventTarget> = (
    event: Event & {
      currentTarget: EventTarget & T;
    }
  ) => any;

  interface Props {
    variant?: InputVariant;
    size?: InputSize | "xs" | "xl" | "default";
    autocomplete?: "on" | "off";
    placeholder?: string;
    value: string;
    id?: string;
    padding?: boolean;
    margin?: "none" | "top" | "bottom" | "both";
    onInput?: any;
    fullwidth?: boolean;
    height?: "20" | "24" | "28" | "32" | "36" | "full" | "default";
    className?: string;
    disabled?: boolean;
    optimaizedInput?: boolean;
    highlight?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    onchange?: () => void;
    oninput?: FormEventHandler<HTMLTextAreaElement>;
    [key: string]: any; // rest props 지원
  }

  let {
    variant = "default",
    size = "default",
    autocomplete = "off",
    placeholder = "",
    value = $bindable(),
    id = undefined,
    padding = true,
    margin = "none",
    onInput = () => {},
    fullwidth = false,
    height = "default",
    className = "",
    disabled = false,
    optimaizedInput = true,
    highlight = false,
    ariaLabel,
    ariaDescribedBy,
    onchange = () => {},
    oninput,
    ...restProps
  }: Props = $props();
  let selectingAutoComplete = $state(0);
  let highlightId = highlight ? getNewHighlightId() : 0;
  let inpa = $state(0);
  let highlightDom: HTMLDivElement = $state();
  let optiValue = $state(value);
  let autoCompleteDom: HTMLDivElement = $state();
  let autocompleteContents: string[] = $state([]);
  let inputDom: HTMLDivElement = $state();

  const autoComplete = () => {
    //autocomplete
    selectingAutoComplete = 0;
    const sel = window.getSelection();
    if (!sel) {
      return;
    }

    const range = sel.getRangeAt(0);

    if (range) {
      const qValue = range.startContainer.textContent;
      const splited = qValue.substring(0, range.startOffset).split("{{");
      if (splited.length === 1) {
        hideAutoComplete();
        return;
      }
      const qText = splited.pop();
      let filtered = AllCBS.filter((cb) => cb.startsWith(qText));
      if (filtered.length === 0) {
        hideAutoComplete();
        return;
      }
      filtered = filtered.slice(0, 10);
      autocompleteContents = filtered;
    }

    const hlRect = highlightDom.getBoundingClientRect();
    const rect = range.getBoundingClientRect();
    if (rect.top === 0 && rect.left === 0) {
      hideAutoComplete();
      return;
    }
    const top = rect.top - hlRect.top + 15;
    const left = rect.left - hlRect.left;
    autoCompleteDom.style.top = top + "px";
    autoCompleteDom.style.left = left + "px";
    autoCompleteDom.style.display = "flex";
  };

  const insertContent = (
    insertContent: string,
    type: "autoComplete" | "paste" = "autoComplete"
  ) => {
    console.log(insertContent);
    const sel = window.getSelection();
    if (sel) {
      const range = sel.getRangeAt(0);
      let content = range.startContainer.textContent;
      let contentStart = content.substring(0, range.startOffset);
      let contentEnd = content.substring(range.startOffset);
      if (type === "autoComplete") {
        contentStart = contentStart.substring(0, contentStart.lastIndexOf("{{"));
        if (insertContent.endsWith(":")) {
          insertContent = `{{${insertContent}:`;
        } else if (insertContent.startsWith("#")) {
          insertContent = `{{${insertContent} `;
        } else {
          insertContent = `{{${insertContent}}}`;
        }
      }

      const cons = contentStart + insertContent + contentEnd;
      range.startContainer.textContent = cons;
      hideAutoComplete();

      try {
        sel.collapse(range.startContainer, contentStart.length + insertContent.length);
      } catch (error) {}
      //invoke onInput

      try {
        inputDom.dispatchEvent(new Event("input"));
        inputDom.dispatchEvent(new Event("change"));
      } catch (error) {}
    }
  };

  const hideAutoComplete = () => {
    autoCompleteDom.style.display = "none";
    selectingAutoComplete = 0;
    autocompleteContents = [];
  };

  onMount(() => {
    highlighter(highlightDom, highlightId);
  });

  onDestroy(() => {
    removeHighlight(highlightId);
  });

  const highlightChange = async (value: string, highlightId: number) => {
    await sleep(1);
    highlighter(highlightDom, highlightId);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (autocompleteContents.length >= 1) {
      switch (e.key) {
        case "ArrowDown":
          selectingAutoComplete = Math.min(
            selectingAutoComplete + 1,
            autocompleteContents.length - 1
          );
          e.preventDefault();
          return;
        case "ArrowUp":
          selectingAutoComplete = Math.max(selectingAutoComplete - 1, 0);
          e.preventDefault();
          return;
        case "Enter":
        case "Tab":
          e.preventDefault();
          insertContent(autocompleteContents[selectingAutoComplete]);
          return;
        case "Escape":
          hideAutoComplete();
          return;
      }
    }
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      insertTextAtSelection("\n");
    }
  };

  function insertTextAtSelection(txt: string) {
    txt = txt.replace(/\r/g, "");

    let div = inputDom;
    let sel = window.getSelection();
    let text = div.textContent;
    let before = Math.min(sel.focusOffset, sel.anchorOffset);
    let after = Math.max(sel.focusOffset, sel.anchorOffset);
    let afterStr = text.substring(after);
    if (afterStr == "") afterStr = "\n";
    div.textContent = text.substring(0, before) + txt + afterStr;
    sel.removeAllRanges();
    let range = document.createRange();
    range.setStart(div.childNodes[0], before + txt.length);
    range.setEnd(div.childNodes[0], before + txt.length);
    sel.addRange(range);
    try {
      inputDom.dispatchEvent(new Event("input"));
      inputDom.dispatchEvent(new Event("change"));
    } catch (error) {}
  }

  // Store 통합 핸들러
  const handleStoreUpdate = (newValue: string) => {
    const selection = $currentSelection;
    if (selection.isComplete && selection.fileType === "risup") {
      risupStore.updateKey(selection.fileId, selection.fieldKey as keyof BotPreset, newValue);
    }
  };

  // 높이 계산 헬퍼
  const getHeightClasses = () => {
    if (height === "full") return "h-full";

    const heightMap = {
      "20": "h-20 min-h-20",
      "24": "h-24 min-h-24",
      "28": "h-28 min-h-28",
      "32": "h-32 min-h-32",
      "36": "h-36 min-h-36",
    };

    if (height !== "default") return heightMap[height] || "";

    // textAreaSize 기반 높이 (기존 시스템 유지)
    const sizeHeightMap = {
      [-5]: "h-20 min-h-20",
      [-4]: "h-24 min-h-24",
      [-3]: "h-28 min-h-28",
      [-2]: "h-32 min-h-32",
      [-1]: "h-36 min-h-36",
      [0]: "h-40 min-h-40",
      [1]: "h-44 min-h-44",
      [2]: "h-48 min-h-48",
      [3]: "h-52 min-h-52",
      [4]: "h-56 min-h-56",
      [5]: "h-60 min-h-60",
    };

    return "h-40 min-h-40";
  };

  // 텍스트 크기 계산 헬퍼
  const getTextSizeClasses = () => {
    if (size !== "default") {
      const sizeMap = {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      };
      return sizeMap[size] || "text-base";
    }

    // textAreaTextSize 기반 크기 (기존 시스템 유지)
    const textSizeMap = {
      [0]: "text-xs",
      [1]: "text-sm",
      [2]: "text-base",
      [3]: "text-lg",
    };

    return "text-base";
  };

  // 컨테이너 스타일 계산 (프로젝트 디자인 시스템 적용)
  const containerClasses = $derived(
    cn(
      // 기본 레이아웃
      "group relative",
      "rounded-lg border transition-all duration-200",
      "overflow-hidden",

      // 배경 및 테두리 (프로젝트 스타일)
      "bg-gradient-to-br from-white via-slate-50 to-slate-100",
      "dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-750 dark:to-slate-700",
      "border-slate-300 dark:border-slate-600",

      // 그림자 효과
      "shadow-sm hover:shadow-md focus-within:shadow-lg",
      "hover:shadow-slate-200/50 dark:hover:shadow-slate-900/20",

      // 포커스 상태 (현대적인 링 효과)
      "focus-within:border-blue-500 dark:focus-within:border-blue-400",
      "focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20",
      "focus-within:bg-white dark:focus-within:bg-slate-800",

      // 크기 및 레이아웃
      fullwidth && "w-full",
      getHeightClasses(),
      getTextSizeClasses(),

      // 마진 설정
      margin === "top" && "mt-4",
      margin === "bottom" && "mb-4",
      margin === "both" && "my-2",

      // 상태별 스타일
      disabled &&
        cn(
          "opacity-60 cursor-not-allowed",
          "bg-slate-100 dark:bg-slate-700",
          "border-slate-200 dark:border-slate-600"
        ),

      // hover 효과 (비활성화 시 제외)
      !disabled &&
        cn(
          "hover:border-slate-400 dark:hover:border-slate-500",
          "hover:bg-gradient-to-br hover:from-slate-50 hover:to-white",
          "dark:hover:bg-gradient-to-br dark:hover:from-slate-750 dark:hover:to-slate-800"
        ),

      // 추가 커스텀 클래스
      className
    )
  );

  // 입력 영역 공통 스타일
  const inputBaseClasses = $derived(
    cn(
      "absolute top-0 left-0 z-50 h-full w-full resize-none overflow-y-auto",
      "bg-transparent text-slate-900 dark:text-slate-100",
      "focus-within:outline-none transition-colors duration-200",
      padding && "px-4 py-3"
    )
  );

  // 자동완성 드롭다운 스타일
  const autocompleteClasses = $derived(
    cn(
      "absolute z-[100] hidden flex-col",
      "border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg",
      "bg-white dark:bg-slate-800 p-2 min-w-[200px]"
    )
  );

  // 자동완성 버튼 스타일
  const autocompleteButtonClasses = (isSelected: boolean) =>
    cn(
      "w-full px-3 py-2 text-left rounded-md transition-colors duration-150",
      "hover:bg-slate-100 dark:hover:bg-slate-700",
      "focus:bg-slate-100 dark:focus:bg-slate-700 focus:outline-none",
      isSelected && "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
    );

  $effect.pre(() => {
    optiValue = value;
  });

  $effect.pre(() => {
    highlightChange(value, highlightId);
  });
</script>

<!--
  TextAreaInput 컴포넌트 - 고급 텍스트 영역 (하이라이팅, 자동완성 지원)

  @example
  <TextAreaInput
    variant="default"
    size="md"
    bind:value={textValue}
    placeholder="텍스트를 입력하세요..."
    highlight={true}
    autocomplete="off"
    ariaLabel="고급 텍스트 입력"
  />
-->

<div class="group relative">
  <div
    class={containerClasses}
    bind:this={highlightDom}
    onfocusout={() => {
      hideAutoComplete();
    }}
    {...restProps}
  >
    {#if !highlight || $disableHighlight}
      <textarea
        class={inputBaseClasses}
        {autocomplete}
        {placeholder}
        {id}
        {disabled}
        bind:value
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
        oninput={(e) => {
          if (optimaizedInput) {
            if (inpa++ > 10) {
              value = e.currentTarget.value;
              inpa = 0;
              onInput();
              handleStoreUpdate(value);
            }
          } else {
            value = e.currentTarget.value;
            onInput();
            handleStoreUpdate(value);
          }
          // 원본 oninput 콜백 실행
          oninput?.(e as any);
        }}
        onchange={(e) => {
          if (optimaizedInput) {
            value = e.currentTarget.value;
            onInput();
            handleStoreUpdate(value);
          }
          onchange();
        }}
      ></textarea>
    {:else}
      <div
        class={cn(inputBaseClasses, "break-words whitespace-pre-wrap")}
        contenteditable="true"
        bind:textContent={value}
        onkeydown={(e) => {
          handleKeyDown(e);
          onInput();
          handleStoreUpdate(value);
        }}
        role="textbox"
        tabindex="0"
        oninput={(e) => {
          autoComplete();
          handleStoreUpdate(value);
        }}
        onchange={(e) => {
          onchange();
        }}
        bind:this={inputDom}
        translate="no"
        aria-label={ariaLabel || "고급 텍스트 입력"}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
      >
        {value ?? ""}
      </div>
    {/if}
    <!-- 자동완성 드롭다운 -->
    <div class={autocompleteClasses} bind:this={autoCompleteDom}>
      {#each autocompleteContents as content, i}
        <button
          class={autocompleteButtonClasses(selectingAutoComplete === i)}
          onclick={() => {
            insertContent(content);
          }}
          aria-label={`자동완성: ${content}`}
        >
          {content}
        </button>
      {/each}
    </div>
  </div>

  <!-- 포커스 시 시각적 표시기 -->
  <div
    class="pointer-events-none absolute inset-0 rounded-lg transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-blue-500/30"
  ></div>
</div>

<!--
  스타일은 component-utils와 Tailwind CSS 클래스로 관리됩니다.
  기존 하이라이팅과 자동완성 기능은 모두 유지됩니다.
-->
