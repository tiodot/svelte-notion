<script lang="ts">

import CollectionViewBoardIcon from './collection-view-board.svelte'
import CollectionViewCalendarIcon from './collection-view-calendar.svelte'
import CollectionViewGalleryIcon from './collection-view-gallery.svelte'
import CollectionViewListIcon from './collection-view-list.svelte'
import CollectionViewTableIcon from './collection-view-table.svelte'

export let type: string;

const iconMap = {
  table: CollectionViewTableIcon,
  board: CollectionViewBoardIcon,
  gallery: CollectionViewGalleryIcon,
  list: CollectionViewListIcon,
  calendar: CollectionViewCalendarIcon
}

const icon = iconMap[type];

</script>
<svelte:component this={icon} ></svelte:component>