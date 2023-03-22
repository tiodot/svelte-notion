<script lang="ts">
  import type {Block} from "notion-types";
  import {
    getBlockParentPage,
    getPageTableOfContents,
    getTextContent,
    uuidToId
  } from 'notion-utils'
  import Text from "../Text.svelte";
  import LinkIcon from '$lib/icons/link-icon.svelte'
	import { recordMapStore } from "../../store";
	import { element } from "svelte/internal";

  export let block: Block;

  export let blockId: string;

  const tocIndentLevelCache: Record<string, number> = {}

  const blockColor = block.format?.block_color

  const id = uuidToId(block.id)
  const title =
    getTextContent(block.properties.title) || `Notion Header ${id}`

  // we use a cache here because constructing the ToC is non-trivial
  let indentLevel = tocIndentLevelCache[block.id]
  let indentLevelClass

  if (indentLevel === undefined) {
    const page = getBlockParentPage(block, $recordMapStore)

    if (page) {
      const toc = getPageTableOfContents(page, $recordMapStore)
      const tocItem = toc.find((tocItem) => tocItem.id === block.id)

      if (tocItem) {
        indentLevel = tocItem.indentLevel
        tocIndentLevelCache[block.id] = indentLevel
      }
    }
  }

  if (indentLevel !== undefined) {
    indentLevelClass = `notion-h-indent-${indentLevel}`
  }

  const isH1 = block.type === 'header'
  const isH2 = block.type === 'sub_header'
  const isH3 = block.type === 'sub_sub_header'

  const classNameStr = [
    isH1 && 'notion-h notion-h1',
    isH2 && 'notion-h notion-h2',
    isH3 && 'notion-h notion-h3',
    blockColor && `notion-${blockColor}`,
    indentLevelClass,
    blockId
  ].filter(Boolean).join(' ')

</script>
{#if block.properties}
  {#if block.format?.toggleable}
    <details class='notion-toggle {blockId}'>
      <summary>
        <svelte:element this={isH1 ? 'h2': isH2 ? 'h3' : 'h4'} class="{classNameStr}" data-id="{id}">
        <span>
          <div id={id} class='notion-header-anchor'></div>
          <span class='notion-h-title'>
            <Text value={block.properties.title} block={block}/>
          </span>
        </span>
        </svelte:element>
      </summary>
      <slot></slot>
    </details>
  {:else }
    <svelte:element this="{isH1 ? 'h2': isH2 ? 'h3' : 'h4'}" class="{classNameStr}" data-id="{id}">
        <span>
          <div id={id} class='notion-header-anchor'></div>
          <a class='notion-hash-link' href={`#${id}`} title={title}>
            <LinkIcon/>
          </a><span class='notion-h-title'>
            <Text value={block.properties.title} block={block}/>
          </span>
        </span>
    </svelte:element>
  {/if}
{/if}