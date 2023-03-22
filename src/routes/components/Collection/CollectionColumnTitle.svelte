<script lang="ts">
  import type{CollectionPropertySchema} from 'notion-types';
  import PropertyIcon from '$lib/icons/property-icon.svelte';

  export let schema: CollectionPropertySchema;

</script>

<div class='notion-collection-column-title'>
  <PropertyIcon
    class='notion-collection-column-title-icon'
    type={schema.type}
  />

  <div class='notion-collection-column-title-body'>{schema.name}</div>
</div>