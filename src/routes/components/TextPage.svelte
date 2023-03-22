<script>
  import {actions, recordMapStore} from "../store";
  import PageTitle from "./PageTitle.svelte";

  /** @type string */
  export let value;
  const linkedBlock = $recordMapStore.block[value]?.value;

  const href = actions.mapPageUrl(value);
</script>

{#if linkedBlock}
  <a class="notion-link" {href}>
    <PageTitle block={linkedBlock}/>
  </a>
{/if}