<script lang="ts">
  import type {Block} from 'notion-types'
  import Render from '../Render.svelte'

  export let block: Block;
  export let level: number;


  const referenceBlockId = block?.format?.transclusion_reference_pointer?.id;

</script>


{#if referenceBlockId}
 <Render blockId={referenceBlockId} {level}></Render> 
{/if}
