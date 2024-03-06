import { Injectable } from '@angular/core';

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
	children?: Navigation[];
}

export interface Navigation extends NavigationItem {
	children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-other',
    children: [
      {
        id: 'Main',
        title: 'Main',
        type: 'item',
        url: '/main',
        classes: 'nav-item',
        icon: 'feather icon-home'
      },
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
            id: 'question-approve',
            title: 'Manage Questions',
            type: 'item',
            url: 'staff/qapprove',          
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
	get() {
		return NavigationItems;
	}
}
