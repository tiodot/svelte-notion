<script lang="ts">
	import type { CollectionPropertySchema, FormulaResult, Block, Collection } from 'notion-types';
	import { evalFormula } from './eval-formula';
	import format from 'date-fns/format/index.js';

	/**@type CollectionPropertySchema*/
	export let schema;
	/** @type Block */
	export let block;
	/** @type Collection */
	export let collection;

	let content: FormulaResult | null = null;

	try {
		content = evalFormula(schema.formula, {
			schema: collection?.schema,
			properties: block?.properties
		});

		if (content instanceof Date) {
			content = format(content, 'MMM d, YYY hh:mm aa');
		}
	} catch (err) {
		content = null;
	}
</script>

{content}
