<script lang="ts">
	import type { Block, Decoration, ExternalObjectInstance } from 'notion-types';
	import { parsePageId } from 'notion-utils';
	import { recordMapStore, actions } from '../store';
	import TextPlain from './TextPlain.svelte';
	import { mapImageUrl } from '$lib/map-image-url';
	import TextPage from './TextPage.svelte';
	import TextExternalLink from './TextExternalLink.svelte';
	import TextLink from './TextLink.svelte';
	import GracefulImage from './GracefulImage.svelte';
	import Equation from './Equation.svelte';

	export let value: Decoration[] = [];
	/** @type  */
	export let block: Block;
	export let linkProps;
	export let linkProtocol;
	export let isInATag = false;

	const components = {
		p: TextPage,
		'‣': TextExternalLink,
		h: TextPlain,
		c: TextPlain,
		b: TextPlain,
		i: TextPlain,
		s: TextPlain,
		_: TextPlain,
		d: TextPlain,
		m: TextPlain,
		e: Equation,
		a: TextLink,
		u: GracefulImage,
		// TODO:
		eoi: TextPlain
	};
</script>

{#each value as [text, decorations], index}
	{#if !decorations}
		<TextPlain {text} />
	{:else}
		{#each decorations as decorator}
			<svelte:component
				this={components[decorator[0]]}
				value={decorator[1]}
				{linkProps}
				{linkProtocol}
				{block}
				{text}
				{isInATag}
				type={decorator[0]}
			/>
		{/each}
	{/if}
{/each}
