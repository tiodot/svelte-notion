<script lang="ts">
  import type {Block} from "notion-types";
  import Text from "../Text.svelte";

  export let block: Block;
  export let blockId: string;
</script>

{#if !block.properties && !block.content?.length}
  <div class='notion-blank {blockId}'>&nbsp;</div>
{:else }
  <div
    class='notion-text {blockId} notion-${block.format?.block_color}'>
    {#if block.properties?.title}
      <Text value={block.properties.title} block={block}/>
    {/if}
    <slot></slot>
    <!--{children && <div className='notion-text-children'>{children}</div>}-->
  </div>
{/if}