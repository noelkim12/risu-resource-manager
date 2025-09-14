<script>
  export let variant = 'default';
  export let size = 'default';
  export let disabled = false;
  export let type = 'button';
  
  $: classes = `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${getVariantClasses(variant)} ${getSizeClasses(size)}`;
  
  function getVariantClasses(variant) {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
      case 'outline':
        return 'border border-input hover:bg-accent hover:text-accent-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
      case 'ghost':
        return 'hover:bg-accent hover:text-accent-foreground';
      case 'link':
        return 'underline-offset-4 hover:underline text-primary';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  }
  
  function getSizeClasses(size) {
    switch (size) {
      case 'sm':
        return 'h-9 px-3 rounded-md';
      case 'lg':
        return 'h-11 px-8 rounded-md';
      default:
        return 'h-10 py-2 px-4';
    }
  }
</script>

<button 
  class={classes}
  {disabled}
  {type}
  on:click
  {...$$restProps}
>
  <slot />
</button>

<style>
  :global(.bg-primary) {
    background-color: hsl(var(--primary, 220.9 39.3% 11%));
  }
  
  :global(.text-primary-foreground) {
    color: hsl(var(--primary-foreground, 210 20% 98%));
  }
  
  :global(.hover\:bg-primary\/90:hover) {
    background-color: hsl(var(--primary, 220.9 39.3% 11%) / 0.9);
  }
  
  :global(.bg-destructive) {
    background-color: hsl(var(--destructive, 0 84.2% 60.2%));
  }
  
  :global(.text-destructive-foreground) {
    color: hsl(var(--destructive-foreground, 210 20% 98%));
  }
  
  :global(.border-input) {
    border-color: hsl(var(--input, 220 13% 91%));
  }
  
  :global(.bg-accent) {
    background-color: hsl(var(--accent, 220 14.3% 95.9%));
  }
  
  :global(.text-accent-foreground) {
    color: hsl(var(--accent-foreground, 220.9 39.3% 11%));
  }
  
  :global(.bg-secondary) {
    background-color: hsl(var(--secondary, 220 14.3% 95.9%));
  }
  
  :global(.text-secondary-foreground) {
    color: hsl(var(--secondary-foreground, 220.9 39.3% 11%));
  }
</style>