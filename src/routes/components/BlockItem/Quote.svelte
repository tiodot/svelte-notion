<script lang="ts">
	import type { Block } from 'notion-types';
  import Text from '../Text.svelte';
	export let block: Block;
	export let blockId: string;
</script>

{#if block.properties}
{@const blockColor = block.format?.block_color}
<blockquote class="notion-quote {blockColor ? 'notion-' + blockColor : ''} {blockId}"><Text value={block.properties.title} {block} /><slot /></blockquote>
{/if}
