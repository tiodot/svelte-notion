import { siteConfig } from './lib/site-config';

export default siteConfig({
	rootNotionPageId: '5e19b09eec9e43c5b4c23031d41fea81',

	// if you want to restrict pages to a single notion workspace (optional)
	// (this should be a Notion ID; see the docs for how to extract this)
	rootNotionSpaceId: undefined,

	// basic site info (required)
	name: 'Do Not Evil',
	domain: 'donotevil.com',
	author: 'DoNotEvil',

	// open graph metadata (optional)
	description: 'Do not evil, to be a better man',

	// default notion icon and cover images for site-wide consistency (optional)
	// page-specific values will override these site-wide defaults
	defaultPageIcon: null,
	defaultPageCover: null,
	defaultPageCoverPosition: 0.5,

	isSearchEnabled: undefined,
	// pageUrlOverrides: {
	//   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
	//   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
	// }
	pageUrlOverrides: undefined,

	// whether to use the default notion navigation style or a custom one with links to
	// important pages
	navigationStyle: 'custom',
	// navigationStyle: 'custom',
	// navigationLinks: [
	//   {
	//     title: 'About',
	//     pageId: 'f1199d37579b41cbabfc0b5174f4256a'
	//   },
	//   {
	//     title: 'Contact',
	//     pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1'
	//   }
	// ]

	googleAnalytics: undefined
});
