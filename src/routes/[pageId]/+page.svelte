
<script lang="ts">
	import { recordMapStore } from '../store';
	import NotionRender from '../components/Render.svelte';
	import type { PageData } from '../$types';
	export let data: PageData;

	const { recordMap, title, site } = data;
	recordMapStore.init(recordMap);
	// console.log('recoardMapStore：', $recordMapStore);

	if (typeof window !== 'undefined') {
		(window as any).recordMap = recordMap;
	}
</script>

<svelte:head>
	<meta content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

	<meta name="robots" content="index,follow" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="twitter:domain" content={site.domain} />

	<meta name="description" content={site.description} />
	<meta property="og:description" content={site.description} />
	<meta name="twitter:description" content={site.description} />

	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<title>{title}</title>
</svelte:head>

<NotionRender />
