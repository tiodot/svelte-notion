<script lang="ts">
	/*递归调用Block*/
	import type { Block as BlockType } from 'notion-types';
	import Block from './Block.svelte';
	import { recordMapStore } from '../store';

	export let level: number = 0;
	export let blockId: string;
	export let block: BlockType;

	if (!block) {
		console.warn('mission block:', blockId);
	}
	// console.log('block.content:', block.content);
</script>

{#if block}
	<Block {level} {block} {blockId}>
		{#each block.content || [] as contentBlockId (contentBlockId)}
			{@const contentBlock = $recordMapStore.block[contentBlockId]?.value}
			<svelte:self levle={level + 1} blockId={contentBlockId} block={contentBlock} />
		{/each}
	</Block>
{/if}
