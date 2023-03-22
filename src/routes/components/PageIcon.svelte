<script>
  import {actions, recordMapStore} from '../store';
  import {getBlockIcon, getBlockTitle, isUrl} from 'notion-utils';
  import {defaultPageIcon} from '$lib/config';
  import defaultPageIconSvg from '$lib/images/default-page-icon.svg';

  import classNames from 'classnames';
  import {mapImageUrl} from '$lib/map-image-url';

  /** @type import("notion-types").Block */
  export let block;
  export let inline = true;
  export let hideDefaultIcon = false;

  const isBlockIcon = ['page', 'callout', 'collection_view', 'collection_view_page'].includes(block.type);

  let isImage = false;

  const icon = getBlockIcon(block, $recordMapStore)?.trim() || defaultPageIcon;
  const title = getBlockTitle(block, $recordMapStore)

  /** @type string | null */
  let iconUrl;

  if (icon) {
    isImage = true;
    if (isUrl(icon)) {
      iconUrl = mapImageUrl(icon, block);
    } else if (icon.startsWith('/icons/')) {
      iconUrl = `https://www.notion.so${icon}`;
    } else {
      isImage = false;
    }

  } else {
    if (!hideDefaultIcon) {
      isImage = true;
      iconUrl = defaultPageIconSvg;
    }
  }


</script>
{#if isBlockIcon && (iconUrl || icon)}
  <div
    class="{classNames( inline ? 'notion-page-icon-inline' : 'notion-page-icon-hero', isImage ? 'notion-page-icon-image' : 'notion-page-icon-span')}">
    {#if iconUrl}
      <img src="{iconUrl}" alt="{title || 'page icon'}">
    {:else}
      <span
        class="notion-page-icon"
        role='img'
        aria-label={icon}
      >
        {icon}
      </span>
    {/if}
  </div>

{/if}


