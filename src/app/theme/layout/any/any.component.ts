import { Component, NgZone } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

import { DattaConfig } from '../../../app-config';
import { NavigationItem, NavigationPreset } from '../../shared/components/navigation/navigation';
import { SecurityService } from 'src/app/security/security.service';

@Component({
	selector: 'app-layout-any',
	templateUrl: './any.component.html',
	styleUrls: ['./any.component.scss']
})
export class LayoutAnyComponent {
	navItems: NavigationItem[];
	
	config;
	navCollapsed;
	navCollapsedMob: boolean;
	windowWidth: number;

	constructor(
		private zone: NgZone, private location: Location,
		private locationStrategy: LocationStrategy,
		private securityService: SecurityService)
	{
		this.config = DattaConfig;
		
		let current_url = this.location.path();
		const baseHref = this.locationStrategy.getBaseHref();
		if (baseHref) {
			current_url = baseHref + this.location.path();
		}

		this.windowWidth = window.innerWidth;

		if (
			current_url === baseHref + '/layout/collapse-menu' ||
			current_url === baseHref + '/layout/box' ||
			(this.windowWidth >= 992 && this.windowWidth <= 1024)
		) {
			DattaConfig.isCollapseMenu = true;
		}

		this.navCollapsed = this.windowWidth >= 992 ? DattaConfig.isCollapseMenu : false;
		this.navCollapsedMob = false;
		
		{
			this.navItems = NavigationPreset.User;
			
			if (securityService.isAdmin())
				this.navItems = NavigationPreset.Admin;
			else if (securityService.isManager())
				this.navItems = NavigationPreset.Staff;
		}
	}

	navMobClick() {
		if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
			this.navCollapsedMob = !this.navCollapsedMob;
			setTimeout(() => {
				this.navCollapsedMob = !this.navCollapsedMob;
			}, 100);
		} else {
			this.navCollapsedMob = !this.navCollapsedMob;
		}
	}
}
