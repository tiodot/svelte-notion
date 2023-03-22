import { site } from '$lib/config';
import { resolveNotionPage } from '$lib/notion';
import { error } from '@sveltejs/kit';
import { getBlockTitle } from 'notion-utils';

export async function load() {
	const recordMap = await resolveNotionPage();
	// console.log('props:', recordMap);

	const keys = Object.keys(recordMap.block) || {};
	const block = recordMap.block[keys[0]].value;

	if (block.type.startsWith('collection_view') && block.collection_id) {
		const collection = recordMap.collection[block.collection_id].value;
		block.format = {
			...block.format,
			page_cover: collection.cover || undefined,
			page_icon: collection.icon
		};
	}
	const title = getBlockTitle(block, recordMap);
	return { title, recordMap, site };
}
