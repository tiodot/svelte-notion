<script lang="ts">
  import type{CollectionViewBlock, CollectionViewPageBlock, PageBlock} from 'notion-types';
  import CollectionColumnTitle from "./CollectionColumnTitle.svelte";
  import CollectionProperty from "./CollectionProperty.svelte";
  import {recordMapStore} from '../../store'

  export let block: CollectionViewBlock | CollectionViewPageBlock | PageBlock;

  /** @type boolean */
  export let pageHeader = false;

  const collectionId = block.parent_id
  const collection = $recordMapStore.collection[collectionId]?.value
  const schemas = collection?.schema

  let propertyIds = Object.keys(schemas || {}).filter((id) => id !== 'title')

  // filter properties based on visibility
  if (collection?.format?.property_visibility) {
    propertyIds = propertyIds.filter(
      (id) =>
        collection.format.property_visibility.find(
          ({property}) => property === id
        )?.visibility !== 'hide'
    )
  }

  // sort properties
  if (collection?.format?.collection_page_properties) {
    // sort properties based on collection page order
    const idToIndex = collection.format?.collection_page_properties.reduce(
      (acc, p, i) => ({
        ...acc,
        [p.property]: i
      }),
      {}
    )

    propertyIds.sort((a, b) => idToIndex[a] - idToIndex[b])
  } else {
    // default to sorting properties alphabetically based on name
    propertyIds.sort((a, b) => schemas[a].name.localeCompare(schemas[b].name))
  }

</script>

<div class='notion-collection-row'>
  <div class='notion-collection-row-body'>
    {#each propertyIds as propertyId(propertyId)}
      {@const schema = schemas[propertyId]}
      <div class='notion-collection-row-property'>
        <CollectionColumnTitle schema={schema}/>

        <div class='notion-collection-row-value'>
          <CollectionProperty
            schema={schema}
            data={block.properties?.[propertyId]}
            propertyId={propertyId}
            block={block}
            collection={collection}
            pageHeader={pageHeader}
          />
        </div>
      </div>
    {/each}
  </div>
</div>