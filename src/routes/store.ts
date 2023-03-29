import type { ExtendedRecordMap } from 'notion-types';
import { writable, get } from 'svelte/store';
import { parsePageId, uuidToId, getCanonicalPageId } from 'notion-utils';
import type { Site } from '$lib/types';
import { site } from '$lib/config';
import { inversePageUrlOverrides, pathBase } from '$lib/config';

// export const site = writable<Site>();

function createRecordMap() {
	const { subscribe, set, update } = writable<ExtendedRecordMap>();

	return {
		subscribe,
		update,
		init: (obj: ExtendedRecordMap) => set(obj)
		// 生成跳转的链接
	};
}

export const recordMapStore = createRecordMap();

const uuid = true;

export const actions = {
	mapPageUrl: (pageId = '') => {
		const pageUuid = parsePageId(pageId, { uuid: true });

		if (uuidToId(pageUuid) === site.rootNotionPageId) {
			return '/';
		} else {
			const cleanPageId = parsePageId(pageId, { uuid: false });
			if (!cleanPageId) {
				return '/';
			}
			const override = inversePageUrlOverrides[cleanPageId];
			if (override) {
				return `/${override}`;
			} else {
				return `${pathBase ? pathBase : ''}/${getCanonicalPageId(pageUuid, get(recordMapStore), { uuid })}`;
			}
		}
	}
};
