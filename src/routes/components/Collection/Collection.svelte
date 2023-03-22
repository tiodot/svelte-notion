<script lang="ts">
  import type{CollectionViewBlock, CollectionViewPageBlock, PageBlock} from 'notion-types';
  import {getBlockCollectionId, getBlockParentPage, getTextContent} from 'notion-utils';
  import CollectionRow from "./CollectionRow.svelte";
  import {recordMapStore} from "../../store";
  import CollectionViewTabs from "./CollectionViewTabs.svelte";
  import PageIcon from "../PageIcon.svelte";
  import CollectionViewGallery from './CollectionViewGallery.svelte';

  export let block: CollectionViewBlock | CollectionViewPageBlock | PageBlock;

  //TODO: support config
  const showCollectionViewDropdown = false;

  const isInValid = block?.type === 'page' && block?.parent_table !== 'collection';

  const {view_ids: viewIds} = block || {};
  const collectionId = getBlockCollectionId(block, $recordMapStore);

  let [defaultCollectionViewId] = viewIds || [];

  // TODO: save defaultViewId into localStorage


  const collection = $recordMapStore.collection[collectionId]?.value
  const collectionView = $recordMapStore.collection_view[defaultCollectionViewId]?.value
  const collectionData =
    $recordMapStore.collection_query[collectionId]?.[defaultCollectionViewId]
  const parentPage = getBlockParentPage(block, $recordMapStore)

  const title = getTextContent(collection?.name).trim()
  const showTitle =
    collectionView?.format?.hide_linked_collection_name !== true && title


</script>

{#if !isInValid}
  {#if block.type === 'page'}
    <CollectionRow {block} pageHeader={true}></CollectionRow>
  {:else }
    <div>
      <div>
        {#if viewIds.length > 1 && showCollectionViewDropdown}
          <CollectionViewTabs
            collectionViewId={defaultCollectionViewId}
            viewIds={viewIds}
            onChangeView={(id) => {defaultCollectionViewId = id }}
          />
        {/if}
      </div>
      {#if showTitle}
        <div class='notion-collection-header'>
          <div class='notion-collection-header-title'>
            <PageIcon
              block={block}
              className='notion-page-title-icon'
              hideDefaultIcon
            />
            {title}
          </div>
        </div>
      {/if}
    </div>
    <div class='notion-collection'>
      <CollectionViewGallery
        collection={collection}
        collectionView={collectionView}
        collectionData={collectionData}
      />
    </div>
  {/if}
{/if}
