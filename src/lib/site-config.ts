import type * as types from './types';

export interface SiteConfig {
	rootNotionPageId: string;
	rootNotionSpaceId?: string;

	name: string;
	domain: string;
	author: string;
	description?: string;

	defaultPageIcon?: string | null;
	defaultPageCover?: string | null;
	defaultPageCoverPosition?: number | null;

	isSearchEnabled?: boolean;

	includeNotionIdInUrls?: boolean;
	pageUrlOverrides?: types.PageUrlOverridesMap;
	pageUrlAdditions?: types.PageUrlOverridesMap;

	navigationStyle?: types.NavigationStyle;
	navigationLinks?: Array<NavigationLink>;

	pathBase?: string;
}

export interface NavigationLink {
	title: string;
	pageId?: string;
	url?: string;
}

export const siteConfig = (config: SiteConfig): SiteConfig => {
	return config;
};
