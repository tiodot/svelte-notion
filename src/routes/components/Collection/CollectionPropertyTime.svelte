<script lang="ts">
  import type {CollectionPropertySchema, Decoration, Block, Collection} from 'notion-types';
  import format from 'date-fns/format/index.js';
  import { formatDate } from "notion-utils";


  export let schema: CollectionPropertySchema;
  export let data: Decoration[];

  export let block: Block;

  export let type = 'created_time'

  export let pageHeader: boolean = false;

  let value = ''

  if (type === 'created_time') {
    value = format(new Date(block?.created_time), 'MMM d, YYY hh:mm aa');
  } else if (type === 'last_edited_time' && pageHeader && block?.last_edited_time) {
    value = `Last updated ${formatDate(block?.last_edited_time, {
      month: "long",
    })}`
  } else if (type === 'last_edited_time') {
    value = format(new Date(block?.last_edited_time), 'MMM d, YYY hh:mm aa')
  }

</script>

{value}