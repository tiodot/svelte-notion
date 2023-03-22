<script lang="ts">
	import type { Block } from 'notion-types';
	import { getBlockTitle } from 'notion-utils';
	import { recordMapStore } from '../store';
	import Text from './Text.svelte';
	import PageIcon from './PageIcon.svelte';

	/** @type Block */
	export let block: Block;

	const isCollectionBlock = ['collection_view_page', 'collection_view'].includes(block?.type);
	const title = isCollectionBlock
		? getBlockTitle(block, $recordMapStore)
		: block?.properties?.title;
</script>

{#if block}
	{#if isCollectionBlock && title}
		<span class="notion-page-title">
			<PageIcon {block} class="notion-page-title-icon" />

			<span class="notion-page-title-text">
				<Text value={[[title]]} {block} />
			</span>
		</span>
	{/if}
	{#if !isCollectionBlock && title}
		<span class="notion-page-title">
			<PageIcon {block} class="notion-page-title-icon" />

			<span class="notion-page-title-text">
				<Text value={block.properties?.title} {block} />
			</span>
		</span>
	{/if}
{/if}
