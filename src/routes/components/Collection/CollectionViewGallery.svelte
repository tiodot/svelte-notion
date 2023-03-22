<script lang="ts">
  import type{Collection, CollectionView, CollectionQueryResult} from 'notion-types'
  import CollectionCard from "./CollectionCard.svelte";
  import {recordMapStore} from "../../store";

  export let collection: Collection;
  export let collectionView: CollectionView;
  export let collectionData: CollectionQueryResult;

  const blockIds =
    (collectionData['collection_group_results']?.blockIds ??
      collectionData['results:relation:uncategorized']?.blockIds ??
      collectionData.blockIds) || [];

  const {
    gallery_cover = {type: 'none'},
    gallery_cover_size = 'medium',
    gallery_cover_aspect = 'cover'
  } = collectionView.format || {}

  const blocks = blockIds?.map(blockId => {
    const block = $recordMapStore.block[blockId]?.value;
    if (!block) return null;
    return {block, blockId}
  }).filter(Boolean)
</script>

<div class='notion-gallery'>
  <div class='notion-gallery-view'>
    <div class='notion-gallery-grid notion-gallery-grid-size-{gallery_cover_size}'>
      {#each blocks as blockItem(blockItem.blockId)}
        <CollectionCard
          collection={collection}
          block={blockItem.block}
          cover={gallery_cover}
          coverSize={gallery_cover_size}
          coverAspect={gallery_cover_aspect}
          properties={collectionView.format?.gallery_properties}
          key={blockItem.blockId}
        />
      {/each}
    </div>
  </div>
</div>