import { NotionAPI } from 'notion-client';
import type { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types';
import { mergeRecordMaps, parsePageId } from 'notion-utils';
import pMap from 'p-map';
import pMemoize from 'p-memoize';
import { notion } from './notion-api';

import {
	navigationLinks,
	navigationStyle,
	pageUrlAdditions,
	pageUrlOverrides,
	site
} from './config';
import { getSiteMap } from './get-site-map';
import type { SiteMap } from './types';

let globalSiteMap: SiteMap;

const getNavigationLinkPages = pMemoize(async (): Promise<ExtendedRecordMap[]> => {
	const navigationLinkPageIds = (navigationLinks || [])
		.map((link) => link && link.pageId)
		.filter(Boolean);

	if (navigationStyle !== 'default' && navigationLinkPageIds.length) {
		return pMap(
			navigationLinkPageIds,
			async (navigationLinkPageId) =>
				notion.getPage(navigationLinkPageId || '', {
					chunkLimit: 1,
					fetchMissingBlocks: false,
					fetchCollections: false,
					signFileUrls: false
				}),
			{
				concurrency: 4
			}
		);
	}

	return [];
});

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
	let recordMap = await notion.getPage(pageId);

	if (navigationStyle !== 'default') {
		// ensure that any pages linked to in the custom navigation header have
		// their block info fully resolved in the page record map so we know
		// the page title, slug, etc.
		const navigationLinkRecordMaps = await getNavigationLinkPages();

		if (navigationLinkRecordMaps?.length) {
			recordMap = navigationLinkRecordMaps.reduce(
				(map, navigationLinkRecordMap) => mergeRecordMaps(map, navigationLinkRecordMap),
				recordMap
			);
		}
	}

	return recordMap;
}

export async function resolveNotionPage(domain?: string, rawPageId?: string) {
	let pageId;
	let recordMap: ExtendedRecordMap;
	if (rawPageId && rawPageId !== 'index') {
		pageId = parsePageId(pageId);

		if (!pageId) {
			const override = pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId];

			if (override) {
				pageId = parsePageId(override);
			}
		}
		if (pageId) {
			recordMap = await getPage(pageId);
		} else {
			if (!globalSiteMap) {
				globalSiteMap = await getSiteMap();
			}
			pageId = globalSiteMap?.canonicalPageMap[rawPageId];
			if (pageId) {
				recordMap = await getPage(pageId);
			}else {
				throw Error('not ---> found')
			}
		}
	} else {
		recordMap = await getPage(site.rootNotionPageId);
	}
	return recordMap;
}
