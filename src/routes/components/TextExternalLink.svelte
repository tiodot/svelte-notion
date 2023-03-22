<script lang="ts">
  import type {Block} from 'notion-types'
  import {actions, recordMapStore} from "../store";
  import PageTitle from "./PageTitle.svelte";
  import {mapImageUrl} from "$lib/map-image-url";
  import GracefulImage from "./GracefulImage.svelte";

  export let value: [string, string];

  export let block: Block;

  const [linkType, id] = value;

  const userInfo = linkType === 'u' ? $recordMapStore.notion_user[id]?.value : null;

  const linkedBlock = linkType !== 'u' ? $recordMapStore.block[id]?.value : null;

</script>

{#if value}
  {#if linkType === 'u'}
    <GracefulImage value={id} {block} />
    <img src="{mapImageUrl(userInfo?.profile_photo || '', block)}" class="notion-user" alt="{userInfo?.given_name}">
  {/if}
  {#if linkedBlock}
    <a class="notion-link" target='_blank' rel='noopener noreferrer' href="{actions.mapPageUrl(id)}">
      <PageTitle block={linkedBlock}/>
    </a>
  {/if}
{/if}