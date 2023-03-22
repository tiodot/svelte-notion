<script lang="ts">
  import type{Block} from "notion-types";
  import Text from "../Text.svelte";
  import {recordMapStore} from "../../store";

  export let block: Block;
  export let blockId: string;

  const groupBlockContent = (blockMap) => {
    const output = []

    let lastType = undefined
    let index = -1

    Object.keys(blockMap).forEach((id) => {
      const blockValue = blockMap[id]?.value

      if (blockValue) {
        blockValue.content?.forEach((blockId) => {
          const blockType = blockMap[blockId]?.value?.type

          if (blockType && blockType !== lastType) {
            index++
            lastType = blockType
            output[index] = []
          }

          if (index > -1) {
            output[index].push(blockId)
          }
        })
      }

      lastType = undefined
    })

    return output
  }

  const getListNumber = (blockId, blockMap) => {
    const groups = groupBlockContent(blockMap)
    const group = groups.find((g) => g.includes(blockId))

    if (!group) {
      return
    }

    return group.indexOf(blockId) + 1
  }

  const isTopLevel =
    block.type !== $recordMapStore.block[block.parent_id]?.value?.type

  const tag = block.type === 'bulleted_list' ? 'ul' : 'ol'
  const classNameStr = `notion-list ${blockId} ${tag === 'ul' ? 'notion-list-disc' : 'notion-list-numbered'}`
  const start = getListNumber(block.id, $recordMapStore.block);

</script>

<svelte:element this={isTopLevel ? tag : 'div'} class={isTopLevel && classNameStr} start={start}>
  {#if block.content}
    {#if block.properties}
      <li>
        <Text value={block.properties.title} block={block}/>
      </li>
    {/if}
    <svelte:element this="{tag}" class="{classNameStr}">
      <slot></slot>
    </svelte:element>
  {:else if block.properties}
    <li>
      <Text value={block.properties.title} block={block}/>
    </li>
  {/if}
</svelte:element>