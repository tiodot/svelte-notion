<script lang="ts">
	export let id: string;
	export let defaultPlay: Boolean;
	export let mute: boolean;
	export let lazyImage: boolean;
	export let iframeTitle: string;
	export let alt: string;
	export let params: Record<string, string>;
	export let adLinksPreconnect: boolean;
	const qs = (params: Record<string, string>) => {
		return Object.keys(params)
			.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
			.join('&');
	};

	const muteParam = mute || defaultPlay ? '1' : '0'; // Default play must be muted
	$: queryString = qs({ autoplay: '1', mute: muteParam, ...params });
	// const mobileResolution = 'hqdefault'
	// const desktopResolution = 'maxresdefault'
	const resolution = 'hqdefault';
	const posterUrl = `https://i.ytimg.com/vi/${id}/${resolution}.jpg`;
	const ytUrl = 'https://www.youtube-nocookie.com';
	const iframeSrc = `${ytUrl}/embed/${id}?${queryString}`;
	let iframeInitialized = false;
</script>

<link rel="preload" href={posterUrl} as="image" />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click={() => {
		iframeInitialized = true;
	}}
	class="notion-yt-lite {iframeInitialized ? 'notion-yt-initialized' : ''}"
	style={$$props.style}
>
	<img src={posterUrl} class="notion-yt-thumbnail" loading={lazyImage ? 'lazy' : undefined} {alt} />

	<div class="notion-yt-playbtn" />

	{#if iframeInitialized}
		<iframe
			width="560"
			height="315"
			frameBorder="0"
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			title={iframeTitle}
			src={iframeSrc}
			on:load={() => {
				console.log('loaded');
			}}
		/>
	{/if}
</div>
