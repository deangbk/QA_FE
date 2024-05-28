import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DattaConfig } from 'app/app-config';

import { NavigationItem } from './navigation';

import { NavContentComponent } from './nav-content/nav-content.component';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
	@ViewChild('navContent') navContent: NavContentComponent;
	
	@Input() navItems: NavigationItem[] = [];
	
	@Output() NavCollapse = new EventEmitter();
	@Output() NavCollapsedMob = new EventEmitter();
	navCollapsed;
	navCollapsedMob;
	windowWidth: number;
	
	constructor() {
		this.windowWidth = window.innerWidth;
		this.navCollapsed = this.windowWidth >= 992 ? DattaConfig.isCollapseMenu : false;
		this.navCollapsedMob = false;
	}

	navCollapse() {
		if (this.windowWidth >= 992) {
			this.navCollapsed = !this.navCollapsed;
			this.NavCollapse.emit();
		}
	}

	navCollapseMob() {
		if (this.windowWidth < 992) {
			this.NavCollapsedMob.emit();
		}
	}
	
	public formatNavItemsBadge() {
		this.navContent.formatNavItemsBadge();
	}
}
