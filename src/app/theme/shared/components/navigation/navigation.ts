import { Injectable } from '@angular/core';

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
		}
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
			NavigationItem.createItem('General Questions', '/questions/general', 'feather icon-clipboard'),
			NavigationItem.createItem('Account Questions', '/questions/account', 'feather icon-layers'),
			NavigationItem.createItem('Submit a Question', '/questions/submit', 'bi bi-question'),

			NavigationItem.createItem('Recent Documents', '/docs/recent', 'bi bi-file-earmark'),
		],
	};
	private static _ITEMS_STAFF: NavigationItem = {
		id: 'cl-staff',
		title: 'Staff Section',
		type: 'collapse',
		icon: 'bi bi-database-fill',
	
		children: [
			NavigationItem.createItem('View Project Users', '/staff/viewusers', null),
			NavigationItem.createItem('Create Project Users', '/staff/addusers', null),

			NavigationItem.createItem('Approve Questions', '/staff/qapprove', null),
			// NavigationItem.createItem('Manage Question', '/staff/qmanage', null),
			NavigationItem.createItem('Upload Documents', '/staff/docupload/0', null),
		],
	};
	private static _ITEMS_ADMIN: NavigationItem = {
		id: 'cl-admin',
		title: 'Admin Section',
		type: 'collapse',
		icon: 'feather icon-aperture',

		children: [
			NavigationItem.createItem('Project Settings', '/admin/project', null),
			NavigationItem.createItem('Project Managers', '/admin/staff', null),
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
