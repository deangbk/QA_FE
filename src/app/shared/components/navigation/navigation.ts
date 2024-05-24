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
