<script lang="ts">
	import { recordMapStore } from '../store';
	import Block from './RecursiveBlock.svelte';

	export let level: number = 0;
	export let blockId: string;

	const id = blockId || Object.keys($recordMapStore.block)[0];
	const block = $recordMapStore.block[id].value;

	if (!block) {
		console.warn('mission block:', id);
	}
  // console.log('block.content:', block.content);
</script>

<Block {level} {block} blockId={id}></Block>
