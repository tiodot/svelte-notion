<script lang="ts">
	import type { Block } from 'notion-types';
	import PageIcon from '../PageIcon.svelte';
	import Text from '../Text.svelte';
	export let block: Block;
	export let blockId: string;

	const classStr = [
		'notion-callout',
		block.format?.block_color && `notion-${block.format?.block_color}_co`,
		blockId
	]
		.filter(Boolean)
		.join(' ');
</script>

<div class={classStr}>
	<PageIcon {block} />

	<div class="notion-callout-text"><Text value={block.properties?.title} {block} /> <slot></slot></div>
</div>
