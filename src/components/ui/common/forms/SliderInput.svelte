<script lang="ts">
  import { cn, getSliderStyles } from "$lib/styles/component-utils";
  import type { InputVariant, InputSize } from "$lib/styles/tokens";
  import { risupStore } from "$lib/stores/risup.store";
  import { currentSelection } from "$lib/stores/selection.store";
  import type { BotPreset } from "../../../../types/risu/preset.types";
  import { language } from "$lib/i18n";

  interface Props {
    variant?: InputVariant;
    size?: InputSize;
    min?: number;
    max?: number;
    value: number;
    marginBottom?: boolean;
    step?: number;
    fixed?: number;
    multiple?: number;
    disableable?: boolean;
    customText?: string | undefined;
    className?: string;
    disabled?: boolean;
    ariaLabel?: string;
    onchange?: Function;
  }

  let {
    variant = "default",
    size = "md",
    min = 0,
    max = 100,
    value = $bindable(),
    marginBottom = false,
    step = 1,
    fixed = 0,
    multiple = 1,
    disableable = false,
    customText = undefined,
    className = "",
    disabled = false,
    ariaLabel,
    onchange,
  }: Props = $props();

  let slider: HTMLDivElement = $state();
  let mouseDown = $state(false);
  let isEnabled = $state(value !== -1000 && value !== undefined);

  // 스타일 클래스 계산
  const sliderClasses = $derived(
    cn(
      getSliderStyles(variant, size),
      marginBottom && "mb-4",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )
  );

  const checkboxClasses = $derived(
    cn(
      "relative flex items-center justify-center rounded-r-none border border-r-0",
      "bg-white transition-all duration-300 ease-out",
      "hover:border-gray-300 hover:shadow-sm focus-within:border-blue-400",
      size === "sm"
        ? "h-6 w-7"
        : size === "md"
          ? "h-7 w-8"
          : size === "lg"
            ? "h-8 w-9"
            : "h-9 w-10",
      "border-gray-200"
    )
  );

  function changeValue(event: PointerEvent) {
    if (disabled || !isEnabled) return;

    const rect = slider.getBoundingClientRect();
    const x = event.clientX - rect.left;
    let newValue = (x / rect.width) * (max - min) + min;
    newValue = Math.round(newValue / step) * step;
    value = Math.min(Math.max(newValue, min), max);

    // Store 업데이트 처리
    updateStore(value);

    // 원본 onchange 콜백 실행
    onchange?.();
  }

  function updateStore(newValue: number) {
    // selection store에서 현재 선택 정보 가져와서 store 업데이트
    const selection = $currentSelection;
    if (selection.isComplete && selection.fileType === "risup") {
      risupStore.updateKey(selection.fileId, selection.fieldKey as keyof BotPreset, newValue);
    }
  }

  function handleCheckboxChange(checked: boolean) {
    isEnabled = checked;
    if (checked) {
      value = min;
    } else {
      value = -1000;
    }

    updateStore(value);
    onchange?.();
  }

  // 백분율 계산
  const percentage = $derived(
    isEnabled && value !== -1000 ? ((value - min) / (max - min)) * 100 : 0
  );

  // 표시할 텍스트 계산
  const displayText = $derived(
    customText !== undefined
      ? customText
      : value === -1000 || value === undefined || !isEnabled
        ? language.disabled
        : (() => {
            const displayValue = value * multiple;
            // multiple이 1이 아닐 때는 적절한 소숫점 자리수 계산
            if (multiple !== 1) {
              // multiple의 소숫점 자리수에 따라 표시 정밀도 결정
              const multipleDecimalPlaces = multiple.toString().split('.')[1]?.length || 0;
              const minDecimalPlaces = Math.max(fixed, multipleDecimalPlaces);
              return displayValue.toFixed(minDecimalPlaces);
            }
            // multiple이 1일 때는 기존 로직 유지 (최소 2자리)
            return displayValue.toFixed(Math.max(fixed, 2));
          })()
  );
</script>

<!--
  SliderInput 컴포넌트 - 현대적인 스타일링과 store 연동

  @example
  <SliderInput
    variant="default"
    size="md"
    min={0}
    max={100}
    bind:value={sliderValue}
    ariaLabel="슬라이더 입력"
    disableable={true}
  />
-->

<div class="group relative flex w-full" class:mb-4={marginBottom} style="padding-bottom: 12px;">
  {#if disableable}
    <div class={checkboxClasses}>
      <input
        type="checkbox"
        checked={isEnabled}
        onchange={(e) => handleCheckboxChange(e.currentTarget.checked)}
        class="h-3.5 w-3.5 rounded border border-gray-300 bg-white text-blue-500 transition-all duration-200 hover:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:ring-offset-1"
        aria-label={ariaLabel ? `${ariaLabel} 활성화` : "슬라이더 활성화"}
        {disabled}
      />
    </div>
  {/if}

  <div
    class={cn(
      sliderClasses,
      disableable && "rounded-l-none border-l-0",
      !isEnabled && "opacity-50"
    )}
    style:background={isEnabled ? "#f1f5f9" : "#f8fafc"}
    onpointerdown={(event) => {
      if (!disabled && isEnabled) {
        mouseDown = true;
        changeValue(event);
      }
    }}
    onpointermove={(event) => {
      if (mouseDown && !disabled && isEnabled) {
        changeValue(event);
      }
    }}
    onpointerup={() => {
      mouseDown = false;
    }}
    onpointerleave={() => {
      mouseDown = false;
    }}
    bind:this={slider}
    role="slider"
    tabindex={disabled ? -1 : 0}
    aria-label={ariaLabel}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={isEnabled ? value : undefined}
    aria-disabled={disabled || !isEnabled}
  >
    <!-- Quarter markers (게이지 표시) -->
    {#if isEnabled}
      <!-- 25% 마커 -->
      <div
        class="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 transform bg-gray-300/60"
        style:left="25%"
      ></div>
      <!-- 50% 마커 (중간값) -->
      <div
        class="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 transform bg-gray-400/80"
        style:left="50%"
      ></div>
      <!-- 75% 마커 -->
      <div
        class="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 transform bg-gray-300/60"
        style:left="75%"
      ></div>
    {/if}

    <!-- 진행 바 (직사각형, rounded 제거) -->
    <div
      class={cn(
        "absolute inset-y-0 left-0 transition-all duration-300 ease-out",
        isEnabled ? "bg-gradient-to-r from-blue-400 to-blue-500" : "bg-gray-300"
      )}
      style:width={`${percentage}%`}
    ></div>

    <!-- 값 표시 레이블 (흰색 텍스트 + 검정 테두리) -->
    <span
      class={cn(
        "absolute left-3 z-20 flex items-center justify-center text-xs font-bold",
        "text-white transition-all duration-300",
        size === "sm" ? "h-6" : size === "md" ? "h-7" : size === "lg" ? "h-8" : "h-9"
      )}
      style="text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000;"
    >
      {!isEnabled ? language.disabled : displayText}
    </span>

    <!-- 삼각형 드래그 핸들 (슬라이더 아래쪽) -->
    {#if isEnabled}
      <div
        class={cn(
          "absolute z-30 -translate-x-1/2 transform",
          "h-0 w-0 cursor-pointer transition-all duration-200 ease-out",
          "hover:scale-110",
          mouseDown && "scale-125",
          size === "sm" ? "top-6" : size === "md" ? "top-7" : size === "lg" ? "top-8" : "top-9"
        )}
        style:left={`${percentage}%`}
        style:border-left="6px solid transparent"
        style:border-right="6px solid transparent"
        style:border-bottom={`8px solid ${mouseDown ? "#1d4ed8" : "#3b82f6"}`}
        style:filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
      ></div>
    {/if}

    <!-- Quarter 값 표시 (작은 텍스트) -->
    {#if isEnabled && percentage < 10}
      <div class="absolute top-1/2 right-2 z-10 -translate-y-1/2 transform">
        <div class="flex space-x-1 text-[10px] text-gray-400">
          <span>¼</span>
          <span>½</span>
          <span>¾</span>
        </div>
      </div>
    {/if}
  </div>
</div>
