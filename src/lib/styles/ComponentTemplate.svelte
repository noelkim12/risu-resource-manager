<!--
  컴포넌트 템플릿
  새로운 UI 컴포넌트 생성 시 사용할 표준 템플릿

  사용법:
  1. 이 파일을 복사하여 새 컴포넌트로 사용
  2. Props 인터페이스를 컴포넌트에 맞게 수정
  3. 스타일 함수를 적절히 변경
  4. 접근성 속성 추가
-->

<script lang="ts">
  import { cn, getButtonStyles } from "./component-utils";
  import type { ButtonVariant, ButtonSize } from "./tokens";

  /**
   * 컴포넌트 Props 인터페이스
   * 표준 props: variant, size, disabled, className
   */
  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    className?: string;
    id?: string;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    // 컴포넌트별 커스텀 props 추가
  }

  let {
    variant = "default",
    size = "md",
    disabled = false,
    className = "",
    id,
    ariaLabel,
    ariaDescribedBy,
    // 구조분해할당으로 props 받기
  }: Props = $props();

  // 스타일 클래스 계산
  $: classes = cn(
    getButtonStyles(variant, size),
    className
  );

  // 이벤트 핸들러
  function handleClick(event: MouseEvent) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    // 클릭 로직
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled) return;

    // Enter 또는 Space 키 처리
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick(event as any);
    }
  }
</script>

<!--
  컴포넌트 마크업
  - 접근성 속성 필수 포함
  - 키보드 내비게이션 지원
  - 적절한 ARIA 레이블
-->
<button
  {id}
  class={classes}
  {disabled}
  type="button"
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-label={ariaLabel}
  aria-describedby={ariaDescribedBy}
  aria-disabled={disabled}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  {...$$restProps}
>
  <!-- 아이콘 슬롯 (선택적) -->
  {#if $$slots.icon}
    <span class="mr-2 flex-shrink-0">
      <slot name="icon" />
    </span>
  {/if}

  <!-- 기본 콘텐츠 슬롯 -->
  <slot />

  <!-- 후행 아이콘 슬롯 (선택적) -->
  {#if $$slots.trailing}
    <span class="ml-2 flex-shrink-0">
      <slot name="trailing" />
    </span>
  {/if}
</button>

<!--
  스타일 가이드라인:

  1. CSS 클래스는 component-utils의 함수 사용
  2. 인라인 스타일 지양, Tailwind 클래스 우선
  3. CSS 변수는 app.css의 디자인 토큰 사용
  4. 컴포넌트별 커스텀 스타일이 필요한 경우에만 <style> 블록 사용
-->

<style>
  /*
    컴포넌트별 커스텀 스타일이 필요한 경우에만 사용
    가능한 한 Tailwind 클래스와 유틸리티 함수 우선 사용
  */
</style>

<!--
  컴포넌트 사용 예시:

  <ComponentTemplate
    variant="primary"
    size="lg"
    ariaLabel="작업 실행"
    onclick={handleAction}
  >
    <svelte:fragment slot="icon">
      <PlayIcon />
    </svelte:fragment>

    작업 실행

    <svelte:fragment slot="trailing">
      <ChevronRightIcon />
    </svelte:fragment>
  </ComponentTemplate>
-->