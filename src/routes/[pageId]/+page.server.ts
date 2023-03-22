import { domain, site } from '$lib/config';
import { resolveNotionPage } from '$lib/notion';
import { getBlockTitle } from 'notion-utils';

export async function load({ params }: {params: {pageId: string}}) {
  console.log('request pageId:', params)
	const recordMap = await resolveNotionPage(domain, params.pageId);
	// console.log('props:', recordMap);
  const keys = Object.keys(recordMap.block) || {};
	const block = recordMap.block[keys[0]].value;
  const title = getBlockTitle(block, recordMap);
	return { title, recordMap, site };
}
