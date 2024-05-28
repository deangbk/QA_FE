import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DattaConfig } from 'app/app-config';

export interface NavigationItem {
	id: string;
	title: string;
	type: 'item' | 'collapse' | 'group';
	translate?: string;
	icon?: string;
	hidden?: boolean;
	url?: string;
	classes?: string;
	exactMatch?: boolean;
	external?: boolean;
	target?: boolean;
	breadcrumbs?: boolean;
	badge?: {
		title?: string;
		type?: string;
	};
	children?: NavigationItem[];
}

export abstract class NavigationBadgeFormatter {
	public abstract format(item: NavigationItem): string;
}

export function createItem(title: string, url: string, icon?: string): NavigationItem {
	return {
		type: 'item',
		classes: 'nav-item',

		id: 'it-' + title.split(/\s+/).join('-'),
		title: title,

		url: url,
		icon: icon,
	};
}
export function createBadgeItem(title: string, url: string, icon?: string, badge?: string): NavigationItem {
	return {
		type: 'item',
		classes: 'nav-item',

		id: 'it-' + title.split(/\s+/).join('-'),
		title: title,

		url: url,
		icon: icon,

		badge: badge ? { title: '$' + badge } : null,
	};
}
