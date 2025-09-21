<script lang="ts">
  import { onMount } from "svelte";
  import { cn, getInputStyles } from "../../../../lib/styles/component-utils";
  import type { InputVariant, InputSize } from "../../../../lib/styles/tokens";
  import { risupStore } from "../../../../lib/stores/risup.store";
  import { currentSelection } from "../../../../lib/stores/selection.store";
  import type { BotPreset } from "../../../../types/risu/preset.types";

  type FormEventHandler<T extends EventTarget> = (
    event: Event & {
      currentTarget: EventTarget & T;
    }
  ) => any;

  interface Props {
    variant?: InputVariant;
    size?: InputSize;
    value?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    minRows?: number;
    maxRows?: number;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    handleLongPress?: (e: MouseEvent) => void;
    oninput?: FormEventHandler<HTMLTextAreaElement>;
    onchange?: FormEventHandler<HTMLTextAreaElement>;
    [key: string]: any; // rest props 지원
  }

  let {
    variant = "default",
    size = "md",
    value = $bindable(""),
    placeholder = "",
    className = "",
    disabled = false,
    fullWidth = false,
    minRows = 2,
    maxRows = 10,
    ariaLabel,
    ariaDescribedBy,
    handleLongPress = (e: MouseEvent) => {},
    oninput,
    onchange,
    ...restProps
  }: Props = $props();

  let textarea: HTMLTextAreaElement = $state();
  let previousScrollHeight = 0;

  // 스타일 클래스 계산
  const classes = $derived(
    cn(
      getInputStyles(variant, size),
      fullWidth && "w-full",
      // Textarea 전용 스타일
      "resize-none overflow-y-auto",
      "transition-all duration-200",
      "font-medium",
      // 최소/최대 높이 제어
      `min-h-[${minRows * 1.5}rem]`,
      `max-h-[${maxRows * 1.5}rem]`,
      className
    )
  );

  // 자동 크기 조절 함수
  function resize() {
    if (!textarea) return;

    textarea.style.height = "auto"; // Reset height
    const scrollHeight = textarea.scrollHeight;
    const minHeight = minRows * 24; // 약 1.5rem per row
    const maxHeight = maxRows * 24;

    const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
    textarea.style.height = `${newHeight}px`;
  }

  // 입력 이벤트 핸들러
  function handleInput(event: Event) {
    const target = event.currentTarget as HTMLTextAreaElement;
    value = target.value;

    // 자동 크기 조절
    if (textarea.scrollHeight !== previousScrollHeight) {
      previousScrollHeight = textarea.scrollHeight;
      resize();
    }

    // selection store에서 현재 선택 정보 가져와서 store 업데이트
    const selection = $currentSelection;
    if (selection.isComplete && selection.fileType === "risup") {
      risupStore.updateKey(selection.fileId, selection.fieldKey as keyof BotPreset, target.value);
    }

    // 원본 oninput 콜백 실행
    oninput?.(event as any);
  }

  function handleChange(event: Event) {
    const target = event.currentTarget as HTMLTextAreaElement;

    // selection store에서 현재 선택 정보 가져와서 store 업데이트
    const selection = $currentSelection;
    if (selection.isComplete && selection.fileType === "risup") {
      risupStore.updateKey(selection.fileId, selection.fieldKey as keyof BotPreset, target.value);
    }

    // 원본 onchange 콜백 실행
    onchange?.(event as any);
  }

  // 컴포넌트 마운트 시 초기 크기 설정
  onMount(() => {
    resize();
  });
</script>

<!--
  TextAreaResizable 컴포넌트 - 자동 크기 조절이 가능한 텍스트 영역

  @example
  <TextAreaResizable
    variant="default"
    size="md"
    bind:value={textValue}
    placeholder="여러 줄 텍스트를 입력하세요..."
    minRows={3}
    maxRows={8}
    ariaLabel="텍스트 영역"
    fullWidth={true}
  />
-->

<div class="group relative">
  <textarea
    bind:this={textarea}
    class={classes}
    {placeholder}
    {disabled}
    bind:value
    oninput={handleInput}
    onchange={handleChange}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-disabled={disabled}
    {...restProps}
  ></textarea>

  <!-- 포커스 시 시각적 표시기 -->
  <div
    class="pointer-events-none absolute inset-0 rounded-lg transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-blue-500/30"
  ></div>
</div>

<!--
  스타일은 getInputStyles() 유틸리티 함수에서 관리됩니다.
  자동 크기 조절은 minRows와 maxRows 설정으로 제어됩니다.
-->