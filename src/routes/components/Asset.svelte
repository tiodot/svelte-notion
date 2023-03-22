<script lang="ts">
	import type { BaseContentBlock, Block } from 'notion-types';
	import { getTextContent } from 'notion-utils';
	import { recordMapStore } from '../store';
	import { mapImageUrl } from '$lib/map-image-url';
	import { camelCaseToDash } from '$lib/style-object';
	import Pdf from './Pdf.svelte';
	import LiteYoutubeEmbed from './LiteYoutubeEmbed.svelte';

	export let block: BaseContentBlock;

	export let zoomalble: boolean;

	const isServer = typeof window === 'undefined';
	const youtubeDomains = new Set([
		'youtu.be',
		'youtube.com',
		'www.youtube.com',
		'youtube-nocookie.com',
		'www.youtube-nocookie.com'
	]);
	const ComponentMap = {
		pdf: Pdf,
		liteYoutube: LiteYoutubeEmbed
	};
	const getYoutubeId = (url: string): string | null => {
		try {
			const { hostname } = new URL(url);
			if (!youtubeDomains.has(hostname)) {
				return null;
			}
			const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/i;

			const match = url.match(regExp);
			if (match && match[2].length == 11) {
				return match[2];
			}
		} catch {
			// ignore invalid urls
		}

		return null;
	};

	const supportedAssetTypes = [
		'video',
		'image',
		'embed',
		'figma',
		'typeform',
		'excalidraw',
		'maps',
		'tweet',
		'pdf',
		'gist',
		'codepen',
		'drive'
	];

	let invalid = !block || !supportedAssetTypes.includes(block.type);

	const style: Record<string, string | undefined> = {
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		alignSelf: 'center',
		width: '100%',
		maxWidth: '100%',
		flexDirection: 'column'
	};

	const assetStyle: Record<string, string> = {};
	let component: { tagName?: string; type: 'element' | 'component'; props: Record<string, any> } = {
		tagName: '',
		type: 'element',
		props: {}
	};

	if (block.format) {
		const {
			block_aspect_ratio,
			block_height,
			block_width,
			block_full_width,
			block_page_width,
			block_preserve_scale
		} = block.format;

		if (block_full_width || block_page_width) {
			if (block_full_width) {
				style.width = '100vw';
			} else {
				style.width = '100%';
			}

			if (block.type === 'video') {
				if (block_height) {
					style.height = block_height + 'px';
				} else if (block_aspect_ratio) {
					style.paddingBottom = `${block_aspect_ratio * 100}%`;
				} else if (block_preserve_scale) {
					style.objectFit = 'contain';
				}
			} else if (block_aspect_ratio && block.type !== 'image') {
				style.paddingBottom = `${block_aspect_ratio * 100}%`;
			} else if (block_height) {
				style.height = block_height + 'px';
			} else if (block_preserve_scale) {
				if (block.type === 'image') {
					style.height = '100%';
				} else {
					// TODO: this is just a guess
					style.paddingBottom = '75%';
					style.minHeight = '100%';
				}
			}
		} else {
			switch (block.format?.block_alignment) {
				case 'center': {
					style.alignSelf = 'center';
					break;
				}
				case 'left': {
					style.alignSelf = 'start';
					break;
				}
				case 'right': {
					style.alignSelf = 'end';
					break;
				}
			}

			if (block_width) {
				style.width = block_width + 'px';
			}

			if (block_preserve_scale && block.type !== 'image') {
				style.paddingBottom = '50%';
				style.minHeight = '100%';
			} else {
				if (block_height && block.type !== 'image') {
					style.height = block_height + 'px';
				}
			}
		}

		if (block.type === 'image') {
			assetStyle.objectFit = 'cover';
		} else if (block_preserve_scale) {
			assetStyle.objectFit = 'contain';
		}
	}

	let source = $recordMapStore.signed_urls?.[block.id] || block.properties?.source?.[0]?.[0];
	let content = null;

	if (!source) {
		invalid = true;
	}

	if (block.type === 'pdf') {
		style.overflow = 'auto';
		style.background = 'rgb(226, 226, 226)';
		style.display = 'block';

		if (!style.padding) {
			style.padding = '8px 16px';
		}

		if (!isServer) {
			component = {
				type: 'component',
				tagName: 'pdf',
				props: {
					file: source
				}
			};
			// console.log('pdf', block, signedUrl)
			// content = <components.Pdf file={source}/>
		}
	} else if (
		block.type === 'embed' ||
		block.type === 'video' ||
		block.type === 'figma' ||
		block.type === 'typeform' ||
		block.type === 'gist' ||
		block.type === 'maps' ||
		block.type === 'excalidraw' ||
		block.type === 'codepen' ||
		block.type === 'drive'
	) {
		if (
			block.type === 'video' &&
			source &&
			source.indexOf('youtube') < 0 &&
			source.indexOf('youtu.be') < 0 &&
			source.indexOf('vimeo') < 0 &&
			source.indexOf('wistia') < 0 &&
			source.indexOf('loom') < 0 &&
			source.indexOf('videoask') < 0 &&
			source.indexOf('getcloudapp') < 0
		) {
			style.paddingBottom = undefined;
			component = {
				tagName: 'video',
				type: 'element',
				props: {
					playsInline: true,
					controls: true,
					preload: 'metadata',
					style: camelCaseToDash(assetStyle),
					src: source,
					title: block.type
				}
			};

			// content = (
			// 	<video
			// 		playsInline
			// 		controls
			// 		preload="metadata"
			// 		style={assetStyle}
			// 		src={source}
			// 		title={block.type}
			// 	/>
			// );
		} else {
			let src = block.format?.display_source || source;

			if (src) {
				const youtubeVideoId: string | null = block.type === 'video' ? getYoutubeId(src) : null;
				// console.log({ youtubeVideoId, src, format: block.format, style })

				if (youtubeVideoId) {
					component = {
						tagName: 'liteYouTube',
						type: 'component',
						props: {
							style: camelCaseToDash(assetStyle),
							class: 'notion-asset-object-fit'
						}
					};
					// content = (
					// 	<LiteYouTubeEmbed
					// 		id={youtubeVideoId}
					// 		style={assetStyle}
					// 		className="notion-asset-object-fit"
					// 	/>
					// );
				} else if (block.type === 'gist') {
					if (!src.endsWith('.pibb')) {
						src = `${src}.pibb`;
					}

					assetStyle.width = '100%';
					style.paddingBottom = '50%';

					component = {
						tagName: 'iframe',
						type: 'element',
						props: {
							style: camelCaseToDash(assetStyle),
							class: 'notion-asset-object-fit',
							src: src,
							title: 'GitHub Gist',
							frameborder: '0',
							lading: 'lazy',
							scrolling: 'auto'
						}
					};
					// TODO: GitHub gists do not resize their height properly
					// content = (
					// 	<iframe
					// 		style={assetStyle}
					// 		className="notion-asset-object-fit"
					// 		src={src}
					// 		title="GitHub Gist"
					// 		frameBorder="0"
					// 		// TODO: is this sandbox necessary?
					// 		// sandbox='allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin'
					// 		// this is important for perf but react's TS definitions don't seem to like it
					// 		loading="lazy"
					// 		scrolling="auto"
					// 	/>
					// );
				} else {
					component = {
						tagName: 'iframe',
						type: 'element',
						props: {
							class: 'notion-asset-object-fit',
							style: camelCaseToDash(assetStyle),
							src: src,
							title: `iframe ${block.type}`,
							frameborder: '0',
							allowfullscreen: true,
							loading: 'lazy',
							scrolling: 'auto'
						}
					};
					// content = (
					// 	<iframe
					// 		className="notion-asset-object-fit"
					// 		style={assetStyle}
					// 		src={src}
					// 		title={`iframe ${block.type}`}
					// 		frameBorder="0"
					// 		// TODO: is this sandbox necessary?
					// 		// sandbox='allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin'
					// 		allowFullScreen
					// 		// this is important for perf but react's TS definitions don't seem to like it
					// 		loading="lazy"
					// 		scrolling="auto"
					// 	/>
					// );
				}
			}
		}
	} else if (block.type === 'image') {
		// console.log('image', block)
		//kind of a hack for now. New file.notion.so images aren't signed correctly
		if (source.includes('file.notion.so')) {
			source = block.properties?.source?.[0]?.[0];
		}
		const src = mapImageUrl(source, block);
		const caption = getTextContent(block.properties?.caption);
		const alt = caption || 'notion image';

		component = {
			type: 'element',
			tagName: 'img',
			props: {
				src,
				alt,
				height: style.height,
				style: camelCaseToDash(assetStyle)
			}
		};
		// content = <img src={src} alt={alt} height={style.height} style={assetStyle} />;
	}
	const styleStr = camelCaseToDash(style);
</script>

{#if !invalid}
	<div style={styleStr}>
		{#if component.type === 'element'}
			<svelte:element this={component.tagName} {...component.props} />
		{:else}
			<svelte:component this={ComponentMap[component.tagName]} {...component.props} />
		{/if}
		{#if block?.type === 'image'}
			<slot />
		{/if}
	</div>
	{#if block.type !== 'image'}
		<slot />
	{/if}
{/if}
