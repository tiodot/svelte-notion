<script lang="ts">
	import { onMount } from 'svelte';
	let PdfViewer: any;
  export let url: string;

	onMount(async () => {
		const module = await import('svelte-pdf');
		PdfViewer = module.default;
	});
</script>

<svelte:component this={PdfViewer} url={url} />
