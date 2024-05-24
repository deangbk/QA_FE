import { Injectable } from '@angular/core';

import { ProjectService } from 'app/data/project.service';

import { NavigationBadgeFormatter, NavigationItem } from 'app/shared/components/navigation/navigation';

function createItem(title: string, url: string, icon?: string): NavigationItem {
	return {
		type: 'item',
		classes: 'nav-item',
		
		id: 'it-' + title.split(/\s+/).join('-'),
		title: title,
		
		url: url,
		icon: icon,
	};
}
function createBadgeItem(title: string, url: string, icon?: string, badge?: string): NavigationItem {
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

@Injectable()
export class ProjectNavigationBadgeFormatter implements NavigationBadgeFormatter {
	constructor(
		private projectService: ProjectService,
	) { }
	
	public format(item: NavigationItem): string {
		if (item.badge && !this.projectService.projectLoading()) {
			if (item.badge.title != null && item.badge.title.startsWith('$')) {
				let symbol = item.badge.title.substring(1);
				//console.log(symbol, this.projectService.projectContents);
				
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
			createItem('Project Home', 'home', 'feather icon-home'),
			//createItem('User Login', 'login', 'user icon-sidebar'),
		],
	};
	private static _ITEMS_SITE: NavigationItem = {
		id: 'gr-questions',
		title: 'Questions',
		type: 'group',
		children: [
			createBadgeItem('General Questions', 'questions/general',
				'feather icon-clipboard', 'pgeneral'),
			createBadgeItem('Account Questions', 'questions/account',
				'feather icon-layers', 'paccount'),
			createItem('Submit a Question', 'questions/submit', 'bi bi-question'),

			createBadgeItem('Recent Documents', 'docs/recent',
				'bi bi-file-earmark', 'documents'),
		],
	};
	private static _ITEMS_STAFF: NavigationItem = {
		id: 'cl-staff',
		title: 'Staff Section',
		type: 'collapse',
		icon: 'bi bi-database-fill',
	
		children: [
			createItem('View Project Users', 'staff/viewusers'),
			createItem('Create Project Users', 'staff/addusers'),
			
			createItem('Approve Questions', 'staff/qapprove'),
			//createItem('Manage Question', 'staff/qmanage'),
			createItem('Upload Documents', 'staff/docupload/0'),
		],
	};
	private static _ITEMS_ADMIN: NavigationItem = {
		id: 'cl-admin',
		title: 'Admin Section',
		type: 'collapse',
		icon: 'feather icon-aperture',

		children: [
			createItem('Project Settings', 'admin/project'),
			createItem('Project Managers', 'admin/staff'),
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
