<script lang="ts">
	import { site } from '$lib/config';
	import type { BaseContentBlock, Block } from 'notion-types';
	import { parsePageId } from 'notion-utils';
	import { actions } from '../store';
	import Asset from './Asset.svelte';
	import Text from './Text.svelte';

	export let block: BaseContentBlock;
	export let blockId: string;

	function isValidURL(str: string) {
		// TODO: replace this with a more well-tested package
		const pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		);
		return !!pattern.test(str);
	}

	function extractHostname(url: string) {
		try {
			const hostname = new URL(url).hostname;
			return hostname;
		} catch (err) {
			return '';
		}
	}

	const caption: string | undefined = block?.properties?.caption?.[0]?.[0] || '';
	const id = parsePageId(caption, { uuid: true });
	const isPage = caption.charAt(0) === '/' && id;
	const isURL = block.type === 'image' && (isPage || isValidURL(caption));

	const classStr = [
		'notion-asset-wrapper',
		`notion-asset-wrapper-${block.type}`,
		block.format?.block_full_width && 'notion-asset-wrapper-full',
		blockId
	]
		.filter(Boolean)
		.join(' ');
</script>

{#if isURL}
	{@const captionHostname = extractHostname(caption)}
	<a
		target={captionHostname && captionHostname !== site.domain && !caption.startsWith('/')
			? '_blank'
			: null}
		href={isPage ? actions.mapPageUrl(id) : caption}
		style="width: 100%"
	>
		<figure class={classStr}>
			<Asset {block} zoomalble={false}>
				{#if block?.properties?.caption && !isURL}
					<figcaption class="notion-asset-caption">
						<Text value={block.properties.caption} {block} />
					</figcaption>
				{/if}
			</Asset>
		</figure>
	</a>
{:else}
	<figure class={classStr}>
		<Asset {block} zoomalble={false}>
			{#if block?.properties?.caption && !isURL}
				<figcaption class="notion-asset-caption">
					<Text value={block.properties.caption} {block} />
				</figcaption>
			{/if}
		</Asset>
	</figure>
{/if}
