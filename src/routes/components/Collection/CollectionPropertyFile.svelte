<script lang="ts">
	import type { CollectionPropertySchema, Decoration, Block, Collection } from 'notion-types';
	import { mapImageUrl } from '$lib/map-image-url';
	import GracefulImage from '../GracefulImage.svelte';

	export let schema: CollectionPropertySchema;
	export let data: Decoration[];

	export let block: Block;

	const files = data.filter((v) => v.length === 2).map((f) => f.flat().flat());
</script>

{#each files as file, index (index)}
	<a
		class="notion-property-file"
		href={mapImageUrl(file[2], block)}
		target="_blank"
		rel="noreferrer noopener"
	>
 <GracefulImage alt={file[0]} src={mapImageUrl(files[2], block)}/>
	</a>
{/each}
