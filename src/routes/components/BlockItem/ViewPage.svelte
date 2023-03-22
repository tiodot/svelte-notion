<script lang="ts">
	import type { Block, PageBlock } from 'notion-types';
	import {
		getBlockCollectionId,
		getBlockIcon,
		getPageTableOfContents,
		getTextContent,
		isUrl,
		uuidToId
	} from 'notion-utils';
	import { actions, recordMapStore } from '../../store';
	import Collection from '../Collection/Collection.svelte';
	import Header from '../Header.svelte';
	import Text from '../Text.svelte';
	import PageTitle from '../PageTitle.svelte';
	import { defaultPageCover, defaultPageCoverPosition, defaultPageIcon, site } from '$lib/config';
	import { mapImageUrl } from '$lib/map-image-url';
	import PageIcon from '../PageIcon.svelte';

	export let block: Block;
	export let level: number;
	export let blockId: string;
	export let blockType: string;
	export let pageCover: string;

	// TODO: config
	const showTableOfContents = true;
	const pageAside = true;
	const minTableOfContentsItems = 2;
	// <---
	// console.log('props:', $$props, site);

	const pageCoverStyleCache: Record<string, string> = {};

	const getCollectionProperties = () => ({
		title: $recordMapStore.collection[getBlockCollectionId(block, $recordMapStore)!]?.value?.name
	});

	const {
		page_icon = defaultPageIcon,
		page_cover = defaultPageCover,
		page_cover_position = defaultPageCoverPosition,
		page_full_width,
		page_small_text
	} = block.format || {};

	const coverPosition = (1 - (page_cover_position || 0.5)) * 100;
	const pageCoverObjectPosition = `center ${coverPosition}%`;
	let pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition];
	if (!pageCoverStyle) {
		pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition] = `object-position: ${pageCoverObjectPosition}`
	}

	const pageIcon = getBlockIcon(block, $recordMapStore) ?? defaultPageIcon;
	const isPageIconUrl = pageIcon && isUrl(pageIcon);

	const toc = getPageTableOfContents(block as PageBlock, $recordMapStore);

	const hasToc = showTableOfContents && toc.length >= minTableOfContentsItems;
	const hasAside = (hasToc || pageAside) && !page_full_width;
	const hasPageCover = pageCover || page_cover;

	const bodyStr = `notion-page-${hasPageCover ? 'has' : 'no'}-cover notion-page-${
		page_icon ? 'has' : 'no'
	}-icon notion-page-has-${isPageIconUrl ? 'image' : 'text'}-icon ${
		uuidToId(block.id) === site.rootNotionPageId ? 'index-page' : ''
	}`;
</script>

<!-- for full page -->
{#if level === 0}
	{@const properties = blockType === 'page' ? block.properties : getCollectionProperties()}
	<div class="notion notion-app {blockId}">
		<div class="notion-viewport" />
		<div class="notion-frame">
			<Header rootOnly={false} {block} />

			<div class="notion-page-scroller">
				{#if hasPageCover}
					<slot name="pageCover">
						<div class="notion-page-cover-wrapper">
							<img
								src={mapImageUrl(page_cover, block)}
								alt={getTextContent(properties?.title)}
								style="{pageCoverStyle}"
								class="notion-page-cover"
							/>
						</div>
					</slot>
				{/if}
				<main class="notion-page {bodyStr}">
					{#if page_icon}
						<PageIcon {block} inline={false} />
					{/if}
					<slot name="pageHeader" />
					<h1 class="notion-title">
						<Text value={properties?.title} {block} />
					</h1>

					{#if blockType === 'collection_view_page' || (blockType === 'page' && block.parent_table === 'collection')}
						<Collection {block} />
					{/if}

					{#if blockType !== 'collection_view_page'}
						<div class="notion-page-content">
							<article class="notion-page-content-inner">
								<slot />
							</article>

							{#if hasAside}
								<!--todo aside  -->
							{/if}
						</div>
					{/if}
					<slot name="pageFooter" />
				</main>
			</div>
		</div>
	</div>
{:else}
	<a
		href={actions.mapPageUrl(block.id)}
		class="notion-page-link {block.format?.block_color &&
			'notion-' + block.format?.block_color} {blockId}"
	>
		<PageTitle {block} />
	</a>
{/if}
