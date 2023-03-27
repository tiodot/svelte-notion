<script lang="ts">
	import type { Block } from 'notion-types';
	import { recordMapStore } from '../../store';
	export let block: Block;
	export let blockId: string;

	const spacerWidth = `min(32px, 4vw)`;
	const ratio = block.format?.column_ratio || 0.5;
	const parent = $recordMapStore.block[block.parent_id]?.value;

	const columns = parent?.content?.length || Math.max(2, Math.ceil(1.0 / ratio));

	const width = `calc((100% - (${columns - 1} * ${spacerWidth})) * ${ratio})`;
</script>

<div class="notion-column {blockId}" style="width: {width}"><slot /></div>
<div class="notion-spacer" />
