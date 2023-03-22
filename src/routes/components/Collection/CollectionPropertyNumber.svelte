<script lang="ts">
  import type {CollectionPropertySchema, Decoration, Block, Collection} from 'notion-types';
  import formatNumber from 'format-number';
  import Text from "../Text.svelte";

  export let schema: CollectionPropertySchema;
  export let data: Decoration[];

  export let block: Block;

  const value = parseFloat(data[0][0] || '0')
  let output = ''

  if (!isNaN(value)) {
    switch (schema.number_format) {
      case 'number_with_commas':
        output = formatNumber()(value)
        break
      case 'percent':
        output = formatNumber({suffix: '%'})(value * 100)
        break
      case 'dollar':
        output = formatNumber({prefix: '$', round: 2, padRight: 2})(
          value
        )
        break
      case 'euro':
        output = formatNumber({prefix: '€', round: 2, padRight: 2})(
          value
        )
        break
      case 'pound':
        output = formatNumber({prefix: '£', round: 2, padRight: 2})(
          value
        )
        break
      case 'yen':
        output = formatNumber({prefix: '¥', round: 0})(value)
        break
      case 'rupee':
        output = formatNumber({prefix: '₹', round: 2, padRight: 2})(
          value
        )
        break
      case 'won':
        output = formatNumber({prefix: '₩', round: 0})(value)
        break
      case 'yuan':
        output = formatNumber({prefix: 'CN¥', round: 2, padRight: 2})(
          value
        )
        break
    }

  }

</script>

{#if output}
  <Text value={[[output]]} block={block}/>
{:else }
  <Text value={data} {block}></Text>
{/if}