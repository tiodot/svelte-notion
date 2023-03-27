<script lang="ts">
  import type {AudioBlock} from 'notion-types'
	import { recordMapStore } from '../../store';

  export let block: AudioBlock;

  const source = $recordMapStore.signed_urls[block.id] || block.properties?.source?.[0]?.[0]
</script>

<div class="notion-audio {$$props.class}">
<audio controls preload="none" src={source}></audio>
</div>