<script lang="ts">
	import type { Block } from 'notion-types';
	import { formatNotionDateTime } from 'notion-utils';
	import TypeGithub from '$lib/icons/type-github.svelte';
	import { recordMapStore } from '../../store';

	export let block: Block;
	export let blockId: string = '';
	export let inline: boolean = false;
	export let value: string;

	// rendered in text.svelte
	if (value && inline) {
		block = $recordMapStore.block[value]?.value;
	}

	const IconMap = {
		github: TypeGithub
	};

	const { original_url, attributes = [], domain } = block?.format || {};
	let isValid = true;
	const data = {
		title: '',
		owner: '',
		lastUpdated: '',
		externalImageType: ''
	};
	if (!original_url || !attributes || !attributes.length) {
		isValid = false;
	} else {
		data.title = attributes.find((attr: { id: string }) => attr.id === 'title')?.values[0];
		data.owner = attributes.find((attr: { id: string }) => attr.id === 'owner')?.values[0];
		const lastUpdatedAt = attributes.find((attr: { id: string }) => attr.id === 'updated_at')
			?.values[0];
		data.lastUpdated = lastUpdatedAt ? formatNotionDateTime(lastUpdatedAt) : '';
	}

	if (domain === 'github.com') {
		data.externalImageType = 'github';
		if (data.owner) {
			const parts = data.owner.split('/');
			data.owner = parts[parts.length - 1];
		}
	}
</script>

{#if isValid}
	<a
		target="_blank"
		rel="noopener noreferrer"
		href={original_url}
		class="notion-external {blockId} {inline
			? 'notion-external-mention'
			: 'notion-external-block notion-row'}"
	>
		{#if data.externalImageType}
			<div class="notion-external-image">
				<svelte:component this={IconMap[data.externalImageType]} />
			</div>
		{/if}
		<div class="notion-external-description">
			<div class="notion-external-title">{data.title}</div>

			{#if data.owner || data.lastUpdated}
				<div class="notion-external-subtitle">
					{#if data.owner}
						<span>{data.owner}</span>
					{/if}
					{#if data.owner && data.lastUpdated}
						<span> • </span>
					{/if}
					{#if data.lastUpdated}
						<span>Updated {data.lastUpdated}</span>
					{/if}
				</div>
			{/if}
		</div>
	</a>
{/if}
