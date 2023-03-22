<script lang="ts">
	import type { Block } from 'notion-types';
	import { getBlockTitle } from 'notion-utils';
	import Prism from 'prismjs';

	import 'prismjs/components/prism-clike.min.js';
	import 'prismjs/components/prism-css-extras.min.js';
	import 'prismjs/components/prism-css.min.js';
	import 'prismjs/components/prism-javascript.min.js';
	import 'prismjs/components/prism-js-extras.min.js';
	import 'prismjs/components/prism-json.min.js';
	import 'prismjs/components/prism-jsx.min.js';
	import 'prismjs/components/prism-tsx.min.js';
	import 'prismjs/components/prism-typescript.min.js';
	import 'prismjs/components/prism-markup-templating.js';
	import 'prismjs/components/prism-markup.js';
	import 'prismjs/components/prism-bash.js';
	import 'prismjs/components/prism-c.js';
	import 'prismjs/components/prism-cpp.js';
	import 'prismjs/components/prism-csharp.js';
	import 'prismjs/components/prism-docker.js';
	import 'prismjs/components/prism-java.js';
	import 'prismjs/components/prism-js-templates.js';
	import 'prismjs/components/prism-coffeescript.js';
	import 'prismjs/components/prism-diff.js';
	import 'prismjs/components/prism-git.js';
	import 'prismjs/components/prism-go.js';
	import 'prismjs/components/prism-graphql.js';
	import 'prismjs/components/prism-handlebars.js';
	import 'prismjs/components/prism-less.js';
	import 'prismjs/components/prism-makefile.js';
	import 'prismjs/components/prism-markdown.js';
	import 'prismjs/components/prism-objectivec.js';
	import 'prismjs/components/prism-ocaml.js';
	import 'prismjs/components/prism-python.js';
	import 'prismjs/components/prism-reason.js';
	import 'prismjs/components/prism-rust.js';
	import 'prismjs/components/prism-sass.js';
	import 'prismjs/components/prism-scss.js';
	import 'prismjs/components/prism-solidity.js';
	import 'prismjs/components/prism-sql.js';
	import 'prismjs/components/prism-stylus.js';
	import 'prismjs/components/prism-swift.js';
	import 'prismjs/components/prism-wasm.js';
	import 'prismjs/components/prism-yaml.js';
	import CopyIcon from '$lib/icons/copy.svelte';
	import { recordMapStore } from '../../store';
	import Text from '../Text.svelte';

	export let block: Block;
	export let defaultLanguage = 'typescript';

	const content = getBlockTitle(block, $recordMapStore);
	const language = (block.properties?.language?.[0]?.[0] || defaultLanguage).toLowerCase();
	const caption = block.properties.caption;

	const htmlStr = Prism.highlight(content, Prism.languages[language], language);

	let isCopied = false;
</script>

<pre class="notion-code"><div class="notion-code-copy"><div
			class="notion-code-copy-button"
			on:click={() => {
				navigator.clipboard.writeText(content).then((res) => {
					isCopied = true;
					setTimeout(() => {
						isCopied = false;
					}, 1200);
				});
			}}><CopyIcon /></div>{#if isCopied}<div class="notion-code-copy-tooltip"><div>{isCopied ? 'Copied' : 'Copy'}</div></div>{/if}</div><code class="language-{language}">{@html htmlStr}</code>
</pre>
{#if caption}
	<figcaption class="notion-asset-caption">
		<Text value={caption} {block} />
	</figcaption>
{/if}
