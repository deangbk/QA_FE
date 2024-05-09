import { Injectable } from '@angular/core';

import { ProjectService } from 'app/data/project.service';

@Injectable()
export class NavigationItem {
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
	
	static createItem(title: string, url: string, icon?: string): NavigationItem {
		return {
			type: 'item',
			classes: 'nav-item',
			
			id: 'it-' + title.split(/\s+/).join('-'),
			title: title,
			
			url: url,
			icon: icon,
		};
	}
	static createBadgeItem(title: string, url: string, icon?: string, badge?: string): NavigationItem {
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
}

@Injectable()
export class NavigationBadgeFormatter {
	constructor(
		private projectService: ProjectService,
	) { }
	
	public format(item: NavigationItem): string {
		if (item.badge && !this.projectService.projectLoading()) {
			if (item.badge.title != null && item.badge.title.startsWith('$')) {
				let symbol = item.badge.title.substring(1);
				console.log(symbol, this.projectService.projectContents);
				switch (symbol) {
					case 'pgeneral':
						return '' + this.projectService.projectContents.gen_posts;
					case 'paccount':
						return '' + this.projectService.projectContents.acc_posts;
					case 'documents':
						return '' + this.projectService.projectContents.documents;
				}
			}
		}
		return null;
	}
}

export class NavigationPreset {
	private static _ITEMS_MAIN: NavigationItem = {
		id: 'gr-main',
		title: 'Main',
		type: 'group',
		children: [
			NavigationItem.createItem('Project Home', '/main', 'feather icon-home'),
			NavigationItem.createItem('User Login', '/login/sign', 'user icon-sidebar'),
		],
	};
	private static _ITEMS_SITE: NavigationItem = {
		id: 'gr-questions',
		title: 'Questions',
		type: 'group',
		children: [
			NavigationItem.createBadgeItem('General Questions', '/questions/general',
				'feather icon-clipboard', 'pgeneral'),
			NavigationItem.createBadgeItem('Account Questions', '/questions/account',
				'feather icon-layers', 'paccount'),
			NavigationItem.createItem('Submit a Question', '/questions/submit', 'bi bi-question'),

			NavigationItem.createBadgeItem('Recent Documents', '/docs/recent',
				'bi bi-file-earmark', 'documents'),
		],
	};
	private static _ITEMS_STAFF: NavigationItem = {
		id: 'cl-staff',
		title: 'Staff Section',
		type: 'collapse',
		icon: 'bi bi-database-fill',
	
		children: [
			NavigationItem.createItem('View Project Users', '/staff/viewusers'),
			NavigationItem.createItem('Create Project Users', '/staff/addusers'),
			
			NavigationItem.createItem('Approve Questions', '/staff/qapprove'),
			// NavigationItem.createItem('Manage Question', '/staff/qmanage'),
			NavigationItem.createItem('Upload Documents', '/staff/docupload/0'),
		],
	};
	private static _ITEMS_ADMIN: NavigationItem = {
		id: 'cl-admin',
		title: 'Admin Section',
		type: 'collapse',
		icon: 'feather icon-aperture',

		children: [
			NavigationItem.createItem('Project Settings', '/admin/project'),
			NavigationItem.createItem('Project Managers', '/admin/staff'),
		],
	};

	public static User: NavigationItem[] = [
		this._ITEMS_MAIN,
		this._ITEMS_SITE,
	];
	public static Staff: NavigationItem[] = [
		...this.User,
		{
			id: 'gr-management',
			title: 'Site Management',
			type: 'group',
			children: [
				this._ITEMS_STAFF,
			]
		},
	];
	public static Admin: NavigationItem[] = [
		...this.User,
		{
			id: 'gr-management',
			title: 'Site Management',
			type: 'group',
			children: [
				this._ITEMS_STAFF,
				this._ITEMS_ADMIN,
			]
		},
	];
}
