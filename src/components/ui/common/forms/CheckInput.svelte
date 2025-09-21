<script lang="ts">
  import { CheckIcon } from "lucide-svelte";

  interface Props {
    check?: boolean;
    onChange?: any;
    margin?: boolean;
    name?: string;
    hiddenName?: boolean;
    reverse?: boolean;
    className?: string;
    grayText?: boolean;
    children?: import("svelte").Snippet;
  }

  let {
    check = $bindable(),
    onChange = (check: boolean) => {},
    margin = true,
    name = "",
    hiddenName = false,
    reverse = false,
    className = "",
    grayText = false,
    children,
  }: Props = $props();
</script>

<label
  class={"flex cursor-pointer items-center space-x-2" +
    (className ? " " + className : "") +
    (grayText ? " text-textcolor2" : " text-textcolor")}
  class:mr-2={margin}
  aria-describedby="{name} {check ? 'abled' : 'disabled'}"
  aria-labelledby="{name} {check ? 'abled' : 'disabled'}"
>
  {#if reverse}
    <span>{name}{@render children?.()}</span>
  {/if}
  <input
    class="hidden"
    type="checkbox"
    alt={name}
    bind:checked={check}
    onchange={() => {
      onChange(check);
    }}
    aria-describedby="{name} {check ? 'abled' : 'disabled'}"
    aria-labelledby="{name} {check ? 'abled' : 'disabled'}"
  />
  <span
    class="flex h-5 min-h-5 w-5 min-w-5 items-center justify-center rounded-md border-2 transition-all duration-200 {check
      ? 'border-blue-500 bg-blue-500 shadow-sm'
      : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'}"
    aria-hidden="true"
    aria-describedby="{name} {check ? 'abled' : 'disabled'}"
    aria-labelledby="{name} {check ? 'abled' : 'disabled'}"
  >
    {#if check}
      <CheckIcon class="h-3 w-3 text-white" strokeWidth={3} />
    {/if}
  </span>
  {#if !hiddenName && !reverse}
    <span>{name}{@render children?.()}</span>
  {/if}
</label>
