<script lang="ts">
	import type { CollectionPropertySchema, Decoration, Block, Collection } from 'notion-types';
	import { actions } from '../../store';
	import Text from '../Text.svelte';
	import ForMula from './CollectionPropteryFormula.svelte';
	import PageTitle from '../PageTitle.svelte';
	import Select from './ColletionPropertySelect.svelte';
	import File from './CollectionPropertyFile.svelte';
	import Checkbox from './CollectionPropertyCheckbox.svelte';
	import Number from './CollectionPropertyNumber.svelte';
	import Time from './CollectionPropertyTime.svelte';

	export let schema: CollectionPropertySchema;
	export let propertyId: string;
	export let data: Decoration[];
	export let block: Block;
	export let collection: Collection;
	export let inline = false;
	export let linkToTitlePage = true;
	export let pageHeader: boolean;
	export let isInATag = false;

	const isValid =
		schema &&
		(data ||
			[
				'checkbox',
				'title',
				'formula',
				'created_by',
				'last_edited_by',
				'created_time',
				'last_edited_time'
			].includes(schema.type));
	const componentsMap = {
		relation: Text,
		formula: ForMula,
		select: Select,
		multi_select: Select,
		person: Text,
		file: File,
		checkbox: Checkbox,
		// TODO: support the inline url
		url: Text,
		email: Text,
		phone_number: Text,
		number: Number,
		created_time: Time,
		last_edited_time: Time,
		text: Text,
		// TODO: published
		date: Text
	};
	const componentsExternalProps = {
		url: {
			linkProps: {
				target: '_blank',
				rel: 'noreferrer noopener'
			},
			inline
		},
		email: {
			linkProtocol: 'mailto'
		},
		phone_number: {
			linkProtocol: 'tel'
		},
		last_edited_time: {
			pageHeader,
			type: 'last_edited_time'
		}
	};
</script>

{#if isValid}
	<span class="notion-property notion-property-{schema.type}">
		{#if schema.type === 'title'}
			{#if block && linkToTitlePage}
				<svelte:element
					this={isInATag ? 'span' : 'a'}
					href={actions.mapPageUrl(block.id)}
					class="notion-page-link"
				>
					<PageTitle {block} />
				</svelte:element>
			{:else}
				<Text {isInATag} value={data} {block} />
			{/if}
		{/if}
		{#if componentsMap[schema.type]}
			<svelte:component
				this={componentsMap[schema.type]}
				{block}
				{schema}
				{collection}
				value={data}
				{isInATag}
				{data}
				{...componentsExternalProps[schema.type] || {}}
			/>
		{/if}
	</span>
{/if}
