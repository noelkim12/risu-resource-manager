<script lang="ts">
  import { cn } from "../../../../lib/styles/component-utils";

  interface Props {
    value: string | number;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
    children?: import('svelte').Snippet;
    [key: string]: any; // rest props 지원
  }

  let {
    value,
    selected = false,
    disabled = false,
    className = "",
    children,
    ...restProps
  }: Props = $props();

  // 스타일 클래스 계산
  const classes = $derived(
    cn(
      // 기본 option 스타일
      "py-2 px-3",
      "text-slate-900 dark:text-slate-100",
      "bg-white dark:bg-slate-800",
      // hover 및 focus 상태
      "hover:bg-blue-50 dark:hover:bg-slate-700",
      "focus:bg-blue-100 dark:focus:bg-slate-600",
      // selected 상태
      selected && "bg-blue-100 dark:bg-slate-600 font-medium",
      // disabled 상태
      disabled && "text-slate-400 dark:text-slate-500 cursor-not-allowed",
      // 추가 스타일
      "transition-colors duration-150",
      "font-medium",
      className
    )
  );
</script>

<!--
  OptionInput 컴포넌트 - Select의 option 요소

  @example
  <SelectInput bind:value={selectedValue}>
    <OptionInput value="option1">옵션 1</OptionInput>
    <OptionInput value="option2" selected={true}>옵션 2</OptionInput>
    <OptionInput value="option3" disabled={true}>비활성 옵션</OptionInput>
  </SelectInput>
-->

<option
  {value}
  {selected}
  {disabled}
  class={classes}
  {...restProps}
>
  {@render children?.()}
</option>

<!--
  스타일은 cn() 유틸리티와 Tailwind CSS 클래스로 관리됩니다.
  option 요소는 브라우저별 스타일링 제약이 있어 제한적입니다.
-->