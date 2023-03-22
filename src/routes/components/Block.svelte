<script lang="ts">
	import type { Block } from 'notion-types';
	import Header from './Header.svelte';
	import Text from './Text.svelte';
	import Collection from './Collection/Collection.svelte';
	import { actions, recordMapStore } from '../store';
	import PageTitle from './PageTitle.svelte';
	import BlockHeader from './BlockItem/Header.svelte';
	import BlockDivider from './BlockItem/Divider.svelte';
	import BlockText from './BlockItem/Text.svelte';
	import BlockList from './BlockItem/List.svelte';
	import BlockCode from './BlockItem/Code.svelte';
	import BlockBookmark from './BlockItem/Bookmark.svelte';
	import { getBlockCollectionId, uuidToId } from 'notion-utils';
	import ViewPage from './BlockItem/ViewPage.svelte';
	import AssetWrapper from './AssetWrapper.svelte';
	import BlockQuote from './BlockItem/Quote.svelte';

	export let block: Block;
	export let level: number;

	/** @type boolean */
	export let hideBlockId = true;

	let type = block.type;
	if (level === 0 && type === 'collection_view') {
		type = 'collection_view_page';
	}
	// console.log('block & level: ', block, level)

	const blockId = hideBlockId ? 'notion-block' : `notion-block-${uuidToId(block.id)}`;

	const BlockMap = {
		collection_view_page: ViewPage,
		page: ViewPage,
		header: BlockHeader,
		sub_header: BlockHeader,
		sub_sub_header: BlockHeader,
		divider: BlockDivider,
		text: BlockText,
		bulleted_list: BlockList,
		numbered_list: BlockList,
		//TODO: Embed
		embed: BlockText,
		code: BlockCode,
		bookmark: BlockBookmark,
		tweet: AssetWrapper,
		maps: AssetWrapper,
		pdf: AssetWrapper,
		figma: AssetWrapper,
		typeform: AssetWrapper,
		codepen: AssetWrapper,
		excalidraw: AssetWrapper,
		image: AssetWrapper,
		gist: AssetWrapper,
		video: AssetWrapper,
		quote: BlockQuote
	};
	// console.log('--->', type)
</script>

<svelte:component this={BlockMap[type]} blockType={type} {level} {block} {blockId}>
	<slot />
</svelte:component>
