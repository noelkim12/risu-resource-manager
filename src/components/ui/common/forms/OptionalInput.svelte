<script lang="ts">
  import { cn, getInputStyles } from "../../../../lib/styles/component-utils";
  import type { InputVariant, InputSize } from "../../../../lib/styles/tokens";
  import { language } from "../../../../lib/i18n";
  import CheckInput from "./CheckInput.svelte";
  import NumberInput from "./NumberInput.svelte";
  import TextInput from "./TextInput.svelte";

  interface Props {
    value: string | number | boolean;
    variant?: InputVariant;
    size?: InputSize;
    numberMode?: boolean;
    boolMode?: boolean;
    marginBottom?: boolean;
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
    ariaLabel?: string;
    [key: string]: any; // rest props 지원
  }

  let {
    value = $bindable(),
    variant = "default",
    size = "md",
    numberMode = false,
    boolMode = false,
    marginBottom = false,
    disabled = false,
    className = "",
    fullWidth = false,
    ariaLabel,
    ...restProps
  }: Props = $props();

  // 값 토글 함수
  const valToggle = () => {
    value = !value;
  };

  // 활성화/비활성화 토글 함수
  const toggleEnabled = () => {
    if (value === null || value === undefined) {
      if (numberMode) {
        value = 0;
      } else if (boolMode) {
        value = false;
      } else {
        value = "";
      }
    } else {
      value = null;
    }
  };

  // 체크박스 스타일
  const checkboxClasses = $derived(
    cn(
      "flex h-full items-center justify-center",
      "border-slate-300 dark:border-slate-600",
      "bg-white dark:bg-slate-800",
      "rounded-l-lg border-r-0",
      "transition-colors duration-200",
      "hover:bg-slate-50 dark:hover:bg-slate-700"
    )
  );

  // 입력 영역 스타일
  const inputClasses = $derived(cn("flex-1", fullWidth && "w-full"));

  // 불린 버튼 스타일
  const boolButtonClasses = (isTrue: boolean, isActive: boolean) =>
    cn(
      "flex-1 px-3 py-2 font-medium transition-all duration-200",
      "border border-slate-300 dark:border-slate-600",
      "bg-white dark:bg-slate-800",
      "hover:bg-slate-50 dark:hover:bg-slate-700",
      // True 버튼
      isTrue &&
        cn(
          "rounded-l-none border-r-0",
          isActive && "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
        ),
      // False 버튼
      !isTrue &&
        cn(
          "rounded-r-lg border-l-0",
          isActive && "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
        ),
      !isActive && "text-slate-500 dark:text-slate-400"
    );
</script>

<!--
  OptionalInput 컴포넌트 - 활성화/비활성화 토글이 가능한 입력 필드

  @example
  <OptionalInput
    bind:value={optionalValue}
    numberMode={true}
    marginBottom={true}
    ariaLabel="선택적 숫자 입력"
  />
-->

<div class={cn("flex items-center", marginBottom && "mb-4", className)} {...restProps}>
  <!-- 활성화/비활성화 체크박스 -->
  <div class={checkboxClasses}>
    <CheckInput
      hiddenName
      check={!(value === null || value === undefined)}
      onChange={toggleEnabled}
    />
  </div>

  <!-- 입력 영역 -->
  {#if value === null || value === undefined}
    <TextInput
      value={language.disabled || "Using default"}
      className={cn(inputClasses, "rounded-l-none")}
      disabled={true}
      ariaLabel={ariaLabel ? `${ariaLabel} (비활성화됨)` : "비활성화된 필드"}
    />
  {:else if typeof value === "string"}
    <TextInput bind:value className={cn(inputClasses, "rounded-l-none")} {disabled} {ariaLabel} />
  {:else if typeof value === "number"}
    <NumberInput bind:value className={cn(inputClasses, "rounded-l-none")} {disabled} {ariaLabel} />
  {:else if typeof value === "boolean"}
    <div class="flex flex-1">
      <button
        class={boolButtonClasses(true, value === true)}
        onclick={valToggle}
        {disabled}
        aria-label={ariaLabel ? `${ariaLabel} - True` : "True 선택"}
      >
        True
      </button>
      <button
        class={boolButtonClasses(false, value === false)}
        onclick={valToggle}
        {disabled}
        aria-label={ariaLabel ? `${ariaLabel} - False` : "False 선택"}
      >
        False
      </button>
    </div>
  {:else}
    <TextInput
      value={language.disabled || "Using default"}
      className={cn(inputClasses, "rounded-l-none")}
      disabled={true}
      ariaLabel={ariaLabel ? `${ariaLabel} (기본값 사용)` : "기본값 사용"}
    />
  {/if}
</div>

<!--
  스타일은 getInputStyles() 유틸리티 함수와 Tailwind CSS 클래스로 관리됩니다.
  체크박스와 입력 필드가 시각적으로 연결되어 있음을 나타내는 스타일을 사용합니다.
-->
