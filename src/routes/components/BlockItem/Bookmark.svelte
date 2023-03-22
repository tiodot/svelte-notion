<script lang="ts">
	import { mapImageUrl } from '$lib/map-image-url';
	import { format } from 'date-fns';
	import type { Block } from 'notion-types';
	import { getTextContent } from 'notion-utils';
	import Text from '../Text.svelte';
	export let block: Block;
	export let blockId: string;

	const getTitle = (link: string) => {
		const title = getTextContent(block.properties.title) || getTextContent(link);
		if (title.startsWith('http')) {
			const url = new URL(title);
			return url.hostname;
		}
		return title;
	};
</script>

{#if block.properties}
	{@const link = block.properties.link}
	{#if link && link[0]?.[0]}
		{@const title = getTitle(link)}
		<div class="notion-row">
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				class="notion-bookmark notion-{block.format?.block_color} {blockId}"
			>
				<div>
					{#if title}
						<div class="notion-bookmark-title">
							<Text value={[[title]]} {block} />
						</div>
					{/if}
					{#if block.properties?.description}
						<div class="notion-bookmark-description">
							<Text value={block.properties.description} {block} />
						</div>
					{/if}
					<div class="notion-bookmark-link">
						{#if block.format?.bookmark_icon}
							<div class="notion-bookmark-link-icon">
								<img src={mapImageUrl(block.format.bookmark_icon, block)} alt={title} />
							</div>
						{/if}
						<div class="notion-bookmark-link-text">
							<Text value={link} {block} />
						</div>
					</div>
				</div>
				{#if block.format?.bookmark_cover}
					<div class="notion-bookmark-image">
						<img
							src={mapImageUrl(block.format?.bookmark_cover, block)}
							alt={title}
							style="object-fit: cover"
						/>
					</div>
				{/if}
			</a>
		</div>
	{/if}
{/if}
