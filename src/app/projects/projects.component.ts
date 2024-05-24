import { Component, NgZone, OnInit } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { DattaConfig } from 'app/app-config';
import { NavigationItem } from 'app/shared/components/navigation/navigation';
import { NavigationPreset } from './navigation';

import { DataService } from 'app/data/data.service';
import { ProjectService } from 'app/data/project.service';
import { SecurityService } from 'app/security/security.service';

@Component({
	selector: 'app-layout-projects',
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss']
})
export class LayoutProjectsComponent implements OnInit {
	navItems: NavigationItem[];
	
	config;
	navCollapsed;
	navCollapsedMob: boolean;
	windowWidth: number;
	
	logoUrl = '';

	constructor(
		private zone: NgZone, private location: Location,
		private locationStrategy: LocationStrategy,
		private router: Router,
		
		private dataService: DataService,
		private projectService: ProjectService,
		private securityService: SecurityService,
	) {
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
	}
	
	ngOnInit() {
		this.projectService.reloadAll().subscribe();
		
		{
			this.navItems = NavigationPreset.User;
		
			if (this.securityService.isAdmin())
				this.navItems = NavigationPreset.Admin;
			else if (this.securityService.isManager())
				this.navItems = NavigationPreset.Staff;
		}
		
		this.listenRouteChange();
	}
	
	listenRouteChange() {
		this.router.events.subscribe((router: NavigationEnd) => {
			let routerUrl = router.urlAfterRedirects;
			if (routerUrl && typeof routerUrl === 'string') {
				// TODO: I forgot what I was trying to do here
				//console.log(routerUrl);
			}
		});
		
		this.projectService.observeImagesLoad()
			.subscribe(_ => {
				this.logoUrl = this.projectService.urlProjectLogo;
			});
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
