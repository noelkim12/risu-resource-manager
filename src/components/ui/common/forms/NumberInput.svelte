<script lang="ts">
  import { cn, getInputStyles } from "$lib/styles/component-utils";
  import type { InputVariant, InputSize } from "$lib/styles/tokens";
  import { risupStore } from "$lib/stores/risup.store";
  import { currentSelection } from "$lib/stores/selection.store";
  import type { BotPreset } from "../../../../types/risu/preset.types";

  type FormEventHandler<T extends EventTarget> = (
    event: Event & {
      currentTarget: EventTarget & T;
    }
  ) => any;

  interface Props {
    min?: number;
    max?: number;
    variant?: InputVariant;
    size?: InputSize;
    autocomplete?: "on" | "off";
    placeholder?: string;
    value: string | number;
    id?: string;
    className?: string;
    disabled?: boolean;
    hideText?: boolean;
    list?: string;
    fullWidth?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    oninput?: FormEventHandler<HTMLInputElement>;
    onchange?: FormEventHandler<HTMLInputElement>;
    [key: string]: any; // rest props 지원
  }

  let {
    min = undefined,
    max = undefined,
    variant = "default",
    size = "md",
    autocomplete = "off",
    placeholder = "",
    value = $bindable(),
    id = undefined,
    className = "",
    disabled = false,
    hideText = false,
    list = undefined,
    fullWidth = false,
    ariaLabel,
    ariaDescribedBy,
    oninput,
    onchange,
    ...restProps
  }: Props = $props();

  // 스타일 클래스 계산
  const classes = $derived(
    cn(
      getInputStyles(variant, size),
      fullWidth && "w-full",
      // 추가 가시성 개선
      "relative",
      "font-medium", // 텍스트를 더 굵게
      className
    )
  );

  // 값 변경 시 store 업데이트 처리
  function handleInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    value = target.value;

    // selection store에서 현재 선택 정보 가져와서 store 업데이트
    const selection = $currentSelection;
    if (selection.isComplete && selection.fileType === "risup") {
      risupStore.updateKey(selection.fileId, selection.fieldKey as keyof BotPreset, target.value);
    }

    // 원본 oninput 콜백 실행
    oninput?.(event as any);
  }

  function handleChange(event: Event) {
    const target = event.currentTarget as HTMLInputElement;

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
  TextInput 컴포넌트 - 개선된 가시성 및 사용성

  @example
  <TextInput
    variant="default"
    size="md"
    placeholder="값을 입력하세요..."
    bind:value={inputValue}
    ariaLabel="입력 필드"
    fullWidth={true}
  />
-->

<div class="group relative">
  <input
    {min}
    {max}
    {id}
    class={classes}
    type="number"
    autocomplete={hideText ? "new-password" : autocomplete}
    placeholder={placeholder || "값을 입력하세요..."}
    {disabled}
    {list}
    bind:value
    oninput={handleInput}
    onchange={handleChange}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-disabled={disabled}
    {...restProps}
  />

  <!-- 포커스 시 시각적 표시기 -->
  <div
    class="pointer-events-none absolute inset-0 rounded-lg transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-blue-500/30"
  ></div>
</div>

<!--
  스타일은 getInputStyles() 유틸리티 함수에서 관리됩니다.
  추가적인 커스텀 스타일이 필요한 경우에만 <style> 블록을 사용하세요.
-->
