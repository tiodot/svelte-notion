<script lang="ts">
	import FileIcon from '$lib/icons/file-icon.svelte';
	import type { FileBlock } from 'notion-types';
	import { recordMapStore } from '../../store';
	import Text from '../Text.svelte';

	export let block: FileBlock;

	const source = $recordMapStore.signed_urls[block.id] || block.properties?.source?.[0]?.[0];
</script>

<div class="notion-audio {$$props.class}">
	<a class="notion-file-link" href={source} target="_blank" rel="noopener noreferrer">
		<span class="notion-file-icon">
			<FileIcon />
		</span>
		<div class="notion-file-info">
			<div class="notion-file-title">
				<Text value={block.properties?.title || [['File']]} {block} />
			</div>
			{#if block.properties?.size}
				<div class="notion-file-size">
					<Text value={block.properties.size} {block} />
				</div>
			{/if}
		</div>
	</a>
</div>
