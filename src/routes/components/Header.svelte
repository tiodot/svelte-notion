<script lang="ts">
	import type { Block as BlockType } from 'notion-types';
	import { getPageBreadcrumbs } from 'notion-utils';
	import PageIcon from './PageIcon.svelte';

	import { recordMapStore } from '../store';
	import Block from './Block.svelte';

	/** @type import("notion-types").Block */
	export let block: BlockType;

	/** @type boolean */
	export let rootOnly;

	const breadcrumbs = getPageBreadcrumbs($recordMapStore, block.id);
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
					<a class="breadcrumb" href="/{block.id}">
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
