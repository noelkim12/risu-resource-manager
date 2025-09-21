<script lang="ts">
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
    value: string | number;
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    children?: import("svelte").Snippet;
    onchange?: FormEventHandler<HTMLSelectElement>;
    [key: string]: any; // rest props 지원
  }

  let {
    variant = "default",
    size = "md",
    value = $bindable(),
    className = "",
    disabled = false,
    fullWidth = false,
    ariaLabel,
    ariaDescribedBy,
    children,
    onchange,
    ...restProps
  }: Props = $props();

  // 스타일 클래스 계산
  const classes = $derived(
    cn(
      getInputStyles(variant, size),
      fullWidth && "w-full",
      // Select 전용 스타일
      "appearance-none cursor-pointer",
      "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700",
      "relative",
      "font-medium",
      "h-15",
      className
    )
  );

  // 값 변경 시 store 업데이트 처리
  function handleChange(event: Event) {
    const target = event.currentTarget as HTMLSelectElement;
    value = target.value;

    // selection store에서 현재 선택 정보 가져와서 store 업데이트
    const selection = $currentSelection;
    if (selection.isComplete && selection.fileType === "risup") {
      risupStore.updateKey(selection.fileId, selection.fieldKey as keyof BotPreset, target.value);
    }

    // 원본 onchange 콜백 실행
    onchange?.(event as any);
  }
</script>

<!--
  SelectInput 컴포넌트 - 개선된 드롭다운 선택기

  @example
  <SelectInput
    variant="default"
    size="md"
    bind:value={selectedValue}
    ariaLabel="옵션 선택"
    fullWidth={true}
  >
    <option value="option1">옵션 1</option>
    <option value="option2">옵션 2</option>
  </SelectInput>
-->

<div class="group relative">
  <select
    class={classes}
    bind:value
    {disabled}
    onchange={handleChange}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-disabled={disabled}
    {...restProps}
  >
    {@render children?.()}
  </select>

  <!-- 드롭다운 화살표 아이콘 -->
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    <svg
      class="h-5 w-5 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </div>

  <!-- 포커스 시 시각적 표시기 -->
  <div
    class="pointer-events-none absolute inset-0 rounded-lg transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-blue-500/30"
  ></div>
</div>

<!--
  스타일은 getInputStyles() 유틸리티 함수에서 관리됩니다.
  추가적인 커스텀 스타일이 필요한 경우에만 <style> 블록을 사용하세요.
-->
