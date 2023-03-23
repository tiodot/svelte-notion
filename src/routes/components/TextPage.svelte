<script lang="ts">
	import { actions, recordMapStore } from '../store';
	import PageTitle from './PageTitle.svelte';

	// in <a> tag need to render as an <span>
	export let isInATag: boolean;

	/** @type string */
	export let value;
	const linkedBlock = $recordMapStore.block[value]?.value;

	const href = actions.mapPageUrl(value);
</script>

{#if linkedBlock}
	<svelte:element this={isInATag ? 'span' : 'a'} {href} class="notion-link">
		<PageTitle block={linkedBlock} />
	</svelte:element>
{/if}
