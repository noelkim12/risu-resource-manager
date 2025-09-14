<script>
  export let variant = 'default';
  
  $: classes = `inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getVariantClasses(variant)}`;
  
  function getVariantClasses(variant) {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent';
      case 'outline':
        return 'text-foreground border-input';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent';
    }
  }
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>

<style>
  :global(.text-foreground) {
    color: hsl(var(--foreground, 220.9 39.3% 11%));
  }
</style>