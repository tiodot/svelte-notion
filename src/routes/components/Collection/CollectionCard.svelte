<script lang="ts">
	import type {
		Block,
		Collection,
		CollectionCardCover,
		CollectionCardCoverSize,
		CollectionCardCoverAspect
	} from 'notion-types';
	import { mapImageUrl } from '$lib/map-image-url';
	import { getTextContent } from 'notion-utils';
	import { actions, recordMapStore } from '../../store';
	import CollectionProperty from './CollectionProperty.svelte';

	export let collection: Collection;
	export let block: Block;
	export let coverSize: CollectionCardCoverSize;
	export let cover: CollectionCardCover;
	export let coverAspect: CollectionCardCoverAspect;
	export let properties;

	type CoverContent = {
		type?: 'image' | 'empty' | 'property',
		src? : string | null,
		caption?: string;
		alt?: string;
		className?: string;
		style?: string;
	}
	const { page_cover_position = 0.5 } = block.format || {};
	const coverPosition = (1 - page_cover_position) * 100;

	let coverContent: CoverContent = {};
	if (cover?.type === 'page_content') {
		const contentBlockId = block.content?.find((blockId) => {
			const block = $recordMapStore.block[blockId]?.value;

			if (block?.type === 'image') {
				return true;
			}
		});

		if (contentBlockId) {
			const contentBlock = $recordMapStore.block[contentBlockId]?.value;

			const source =
				contentBlock.properties?.source?.[0]?.[0] ?? contentBlock.format?.display_source;

			if (source) {
				const src = mapImageUrl(source, contentBlock);
				const caption = contentBlock.properties?.caption?.[0]?.[0];

				coverContent = {
					type: 'image',
					src,
					caption,
					style: `object-fit: ${coverAspect};`
				};
			}
		}

		if (!coverContent) {
			coverContent = {
				type: 'empty',
				className: 'notion-collection-card-cover-empty'
			};
		}
	} else if (cover?.type === 'page_cover') {
		const { page_cover } = block.format || {};

		if (page_cover) {
			const coverPosition = (1 - page_cover_position) * 100;

			coverContent = {
				type: 'image',
				src: mapImageUrl(page_cover, block),
				style: `object-fit: ${coverAspect}; object-position: center ${coverPosition}%`,
				alt: getTextContent(block.properties?.title)
			};
		}
	} else if (cover?.type === 'property') {
		const { property } = cover;
		const schema = collection.schema[property!];
		const data = block.properties?.[property!];

		if (schema && data) {
			if (schema.type === 'file') {
				const files = data.filter((v) => v.length === 2).map((f) => f.flat().flat());
				const file = files[0];

				if (file) {
					coverContent = {
						type: 'image',
						src: mapImageUrl(file[2], block),
						alt: file[0],
						style: `object-fit: ${coverAspect}; object-position: center ${coverPosition}%`,
						className: `notion-property-${schema.type}`
					};
				}
			} else {
				coverContent = {
					type: 'property',
					propertyId: property,
					schema: schema,
					data: data
				};
			}
		}
	}

	const collectionProperties = properties
		?.filter((p) => p.visible && p.property !== 'title' && collection.schema[p.property])
		.map((p) => {
			if (!block.properties) return null;
			const schema = collection.schema[p.property];
			const data = block.properties[p.property];

			return {
				key: p.property,
				schema,
				data,
				block,
				collection,
				inline: true
			};
		})
		.filter(Boolean);
</script>

<a
	class="notion-collection-card notion-collection-card-size-{coverSize}"
	href={actions.mapPageUrl(block.id)}
>
	{#if coverContent || cover?.type !== 'none'}
		<div class="notion-collection-card-cover">
			{#if coverContent.type === 'image'}
				<img
					src={coverContent.src}
					class={coverContent.className || ''}
					style={coverContent.style}
					alt={coverContent.alt || coverContent.caption}
				/>
			{:else if coverContent.type === 'empty'}
				<div class={coverContent.className} />
			{:else if coverContent.type === 'property'}
				<CollectionProperty
					propertyId={coverContent.propertyId}
					schema={coverContent.schema}
					isInATag={true}
					data={coverContent.data}
				/>
			{/if}
		</div>
	{/if}


	<div class="notion-collection-card-body">
		<div class="notion-collection-card-property">
			<CollectionProperty
				schema={collection.schema.title}
				data={block?.properties?.title}
				{block}
				isInATag={true}
				{collection}
			/>
		</div>

		{#each collectionProperties as property (property.key)}
			<div class="notion-collection-card-property">
				<CollectionProperty
					schema={property.schema}
					data={property.data}
					isInATag={true}
					block={property.block}
					collection={property.collection}
					inline={property.inline}
				/>
			</div>
		{/each}
	</div>
</a>
