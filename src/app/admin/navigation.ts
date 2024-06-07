import { Injectable } from '@angular/core';

import {
	NavigationItem,
	createItem, createBadgeItem,
} from 'app/shared/components/navigation/navigation';

export class NavigationPreset {
	private static _ITEMS_MAIN: NavigationItem = {
		id: 'gr-main',
		title: 'Main',
		type: 'group',
		
		children: [
			createItem('Admin Home', 'home', 'feather icon-home'),
		],
	};
	private static _ITEMS_PROJECTS: NavigationItem = {
		id: 'gr-projects',
		title: 'Projects',
		type: 'group',
		
		children: [
			createItem('Manage Projects', 'projects/manage', 'bi bi-database'),
		],
	};
	private static _ITEMS_SITE: NavigationItem = {
		id: 'gr-site',
		title: 'Site Maintenance',
		type: 'group',
	
		children: [
			createItem('Administrators', 'site/admin', 'bi bi-gem'),
			createItem('Site Settings', 'site/settings', 'bi bi-nut'),
		],
	};

	public static Admin: NavigationItem[] = [
		this._ITEMS_MAIN,
		this._ITEMS_PROJECTS,
		this._ITEMS_SITE,
	];
}
