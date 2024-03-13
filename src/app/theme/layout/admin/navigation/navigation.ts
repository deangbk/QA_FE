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
	
	static get() {
		return NavigationItems;
	}
}

const NavigationItems: NavigationItem[] = [
	{
		id: 'gr-main',
		title: 'Main',
		type: 'group',
		children: [
			NavigationItem.createItem('Project Home', '/main', 'feather icon-home'),
			NavigationItem.createItem('User Login', '/login', 'user icon-sidebar'),
		]
	},
	{
		id: 'gr-questions',
		title: 'Questions',
		type: 'group',
		children: [
			NavigationItem.createItem('General Questions', '/questions/general', 'feather icon-clipboard'),
			NavigationItem.createItem('Account Questions', '/questions/account', 'feather icon-layers'),
			NavigationItem.createItem('Submit a Question', '/questions/submit', 'bi bi-question'),

			NavigationItem.createItem('Recent Documents', '/docs/recent', 'bi bi-file-earmark'),
		]
	},
	{
		id: 'gr-staff',
		title: 'Site Management',
		type: 'group',
		children: [
			{
				id: 'cl-staff',
				title: 'Staff Section',
				type: 'collapse',
				icon: 'bi bi-database-fill',
				
				children: [
					NavigationItem.createItem('View Project Users', '/staff/viewusers', null),
					NavigationItem.createItem('Create Project Users', '/staff/addusers', null),

					NavigationItem.createItem('Approve Questions', '/staff/qapprove', null),
					// NavigationItem.createItem('Manage Question', '/staff/qmanage', null),
				]
			},
		]
	},
];

/* const NavigationItems: NavigationItem[] = [
	{
		id: 'project',
		title: 'Project',
		type: 'group',
		icon: 'feather icon-book',
		children: [
			{
				id: 'questions-account',
				title: 'Account Questions',
				type: 'item',
				url: '/questions/account',
				classes: 'nav-item',
				icon: 'feather icon-layers'
			},
			{
				id: 'questions-general',
				title: 'General Questions',
				type: 'item',
				url: '/questions/general',
				classes: 'nav-item',
				icon: 'feather icon-clipboard'
			},
			{
				id: 'question-submit',
				title: 'Submit Question',
				type: 'item',
				url: '/questions/submit',
				classes: 'nav-item',
				icon: 'bi bi-question'
			},
			{
				id: 'recent-docs',
				title: 'Recent Documents',
				type: 'item',
				url: '/docs/recent',
				classes: 'nav-item',
				icon: 'feather icon-list'
			},
			{
				id: 'home-login',
				title: 'User Login',
				type: 'item',
				url: '/login',
				classes: 'nav-item',
				icon: 'user icon-sidebar'
			},
			{
				id: 'staff-access',
				title: 'Staff Access',
				type: 'collapse',
				icon: 'feather icon-menu',
				children: [
					{
						id: 'app-view-users',
						title: 'View Project Users',
						type: 'item',
						url: 'staff/viewusers',
						external: true
					},
					{
						id: 'app-add-users',
						title: 'Create Project Users',
						type: 'item',
						url: 'staff/addusers',
						external: true
					},
					{
						id: 'question-approve',
						title: 'Approve Questions',
						type: 'item',
						url: 'staff/qapprove',
						external: true
					},
					// {
					// 	id: 'question-manage',
					// 	title: 'Manage Questions',
					// 	type: 'item',
					// 	url: 'staff/qmanage',
					// 	external: true
					// },
					// {
					// 	id: 'menu-level-2.2',
					// 	title: 'Menu Level 2.2',
					// 	type: 'collapse',
					// 	children: [
					// 		{
					// 			id: 'menu-level-2.2.1',
					// 			title: 'Menu Level 2.2.1',
					// 			type: 'item',
					// 			url: 'javascript:',
					// 			external: true
					// 		},
					// 		{
					// 			id: 'menu-level-2.2.2',
					// 			title: 'Menu Level 2.2.2',
					// 			type: 'item',
					// 			url: 'javascript:',
					// 			external: true
					// 		}
					// 	]
					// }
				]
			}
		]
	}
]; */


