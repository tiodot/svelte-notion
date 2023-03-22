<script lang="ts">
	import type { CollectionPropertySchema, Decoration, Block, Collection } from 'notion-types';

	export let schema: CollectionPropertySchema;
	export let data: Decoration[];

	const values = (data?.[0]?.[0] || '').split(',');

	const getColor = (val) => {
		const option = schema.options?.find((option) => val === option.value);
		return option?.color;
	};
</script>

{#each values as value, index (index)}
	<div class="notion-property-{schema.type}-item notion-item-{getColor(value)}">
		{value}
	</div>
{/each}
