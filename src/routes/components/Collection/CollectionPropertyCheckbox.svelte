<script lang="ts">
  import type {CollectionPropertySchema, Decoration, Block, Collection} from 'notion-types';
  import Checkbox from "../Checkbox.svelte";

  export let schema: CollectionPropertySchema;
  export let data: Decoration[];

  export let isChecked: boolean = false;

</script>

<div class='notion-property-checkbox-container'>
  <Checkbox isChecked={isChecked} />
  <span class='notion-property-checkbox-text'>{schema.name}</span>
</div>