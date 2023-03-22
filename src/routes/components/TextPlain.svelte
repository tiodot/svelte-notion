<script>
  import {formatDate} from 'notion-utils'

  /** @type string */
  export let type;
  /** @type string */
  export let text;

  /** @type string */
  export let value;
</script>

{#if type}
  {#if type === 'h'}
    <span class="notion-{value}">{text}</span>
  {:else if type === 'c'}
    <code class='notion-inline-code'>{text}</code>
  {:else if type === 'b'}
    <b>{text}</b>
  {:else if type === 'i'}
    <em>{text}</em>
  {:else if type === 's'}
    <s>{text}</s>
  {:else if type === '_'}
    <span class='notion-inline-underscore'>{text}</span>
  {:else if type === 'm'}
    {text}
  {:else if type === 'd'}
    {#if value?.type === 'date'}
      {formatDate(value?.start_date)}
    {:else if value?.type === 'daterange'}
      {`${formatDate(value.start_date)} → ${formatDate(value.end_date)}`}
    {:else }
      {text}
    {/if}
  {:else }
    {text}
  {/if}

{:else }
  {#if text === ','}
    <span class="text-plain"></span>
  {:else}
    {@html text}
  {/if}
{/if}

<style>
  .text-plain {
    padding: 0.5em;
  }
</style>