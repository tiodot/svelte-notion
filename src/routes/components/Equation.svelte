<script>
  import { onMount } from 'svelte';

  /**@type string */
  export let value;

  let Katex;

  const sleep = ms => new Promise(f => setTimeout(f, ms));

  onMount(async () => {
    Katex = (await import('svelte-katex')).default;
  });
</script>
{#if value}
<span class="notion-equation notion-equation-inline">
  <svelte:component this={Katex}>
  {value}
</svelte:component>
</span>
{/if}
