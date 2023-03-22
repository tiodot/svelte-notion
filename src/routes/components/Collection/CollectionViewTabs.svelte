<script lang="ts">
	import { recordMapStore } from '../../store';
	import CollectionViewIcon from '$lib/icons/collection-view-icon.svelte';
	export let collectionViewId: string;
	/**@type string[] */
	export let viewIds: string[] = [];
	/**@type function(viewId: string) => unknown */
	export let onChangeView = () => {};
</script>

<div class="notion-collection-view-tabs-row">
	{#each viewIds as viewId (viewId)}
		{@const collectionView = $recordMapStore.collection_view[viewId]?.value}
		<button
			onClick={() => onChangeView(viewId)}
			class="notion-collection-view-tabs-content-item {collectionViewId === viewId &&
				'notion-collection-view-tabs-content-item-active'}"
		>
			<div class="notion-collection-view-type">
				<CollectionViewIcon class="notion-collection-view-type-icon" type={collectionView.type} />
				<span class="notion-collection-view-type-title"
					>{collectionView.name ||
						`${collectionView.type[0].toUpperCase()}${collectionView.type.slice(1)} view`}</span
				>
			</div>
		</button>
	{/each}
</div>
