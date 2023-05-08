<script lang="ts">
	import type { Collection, Block as BlockType, ExtendedRecordMap } from 'notion-types';
	import { getBlockTitle, getBlockIcon } from 'notion-utils';
	import PageIcon from './PageIcon.svelte';

	import { recordMapStore, actions } from '../store';

	export let block: BlockType;

	export let rootOnly: boolean;

	const getBlockParentPage = (block: BlockType, recordMap: ExtendedRecordMap) => {
		let currentRecord: BlockType | Collection = block;

		while (currentRecord) {
			const parentId: string = currentRecord.parent_id;
			const parentTable = currentRecord.parent_table;

			if (!parentId) {
				break;
			}

			if (parentTable === 'space' && currentRecord !== block) {
				return currentRecord;
			}

			if (parentTable === 'collection') {
				currentRecord = recordMap.collection[parentId]?.value;
			} else {
				currentRecord = recordMap.block[parentId]?.value;

				if ((currentRecord as BlockType)?.type === 'page') {
					return currentRecord;
				}
			}
		}

		return null;
	};

	const getPageBreadcrumbs = (recordMap: ExtendedRecordMap, activePageId: string) => {
		const blockMap = recordMap.block;
		const breadcrumbs = [];

		let currentPageId = activePageId;

		do {
			const block = blockMap[currentPageId]?.value;
			if (!block) {
				break;
			}

			const title = getBlockTitle(block, recordMap);
			const icon = getBlockIcon(block, recordMap);

			if (!(title || icon)) {
				break;
			}

			breadcrumbs.push({
				block,
				active: currentPageId === activePageId,
				pageId: currentPageId,
				title,
				icon
			});

			const parentBlock = getBlockParentPage(block, recordMap);
			const parentId = parentBlock?.id;

			if (!parentId) {
				break;
			}

			currentPageId = parentId;

			// eslint-disable-next-line no-constant-condition
		} while (true);

		breadcrumbs.reverse();

		return breadcrumbs;
	};
	const breadcrumbs = getPageBreadcrumbs($recordMapStore, block.id);
	console.log(breadcrumbs);
	const actualBreadcrumbs = (rootOnly ? [breadcrumbs?.[0]].filter(Boolean) : breadcrumbs) || [];
</script>

<header class="notion-header">
	<div class="notion-nav-header">
		<div class="breadcrumbs">
			{#each actualBreadcrumbs as breadcrumb, index (breadcrumb.pageId)}
				{#if breadcrumb.active}
					<div class="breadcrumb active">
						{#if breadcrumb.icon}
							<PageIcon block={breadcrumb.block} />
						{/if}

						{#if breadcrumb.title}
							<span class="title">{breadcrumb.title}</span>
						{/if}
					</div>
				{:else}
					<a class="breadcrumb" href="{actions.mapPageUrl(breadcrumb.pageId)}">
						{#if breadcrumb.icon}
							<PageIcon block={breadcrumb.block} />
						{/if}

						{#if breadcrumb.title}
							<span class="title">{breadcrumb.title}</span>
						{/if}
					</a>
				{/if}
				{#if index < actualBreadcrumbs.length - 1}
					<span class="spacer">/</span>
				{/if}
			{/each}
		</div>
	</div>
</header>
