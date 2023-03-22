<script>
	// import './styles.css';
	import './notion.css';
	import './prism-theme.css';
</script>

<div class="app">
	<slot />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

</style>
