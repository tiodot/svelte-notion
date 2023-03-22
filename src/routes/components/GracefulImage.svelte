<script>
  import {recordMapStore} from "../store";
  import {mapImageUrl} from "$lib/map-image-url";

  /** @type Block */
  export let block;

  /** @type string */
  export let value;

  const userInfo = $recordMapStore.notion_user[value]?.value;

</script>

{#if userInfo}
  <img src="{mapImageUrl(userInfo.profile_photo, block)}" class="notion-user" alt="{userInfo.given_name}">
{/if}
