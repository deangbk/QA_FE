import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { DattaConfig } from 'app/app-config';

import { NavigationItem } from 'app/shared/components/navigation/navigation';
import { NavigationComponent } from 'app/shared/components/navigation/navigation.component';
import { NavigationPreset } from './navigation';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';
import { ProjectService } from './service/project.service';

@Component({
	selector: 'app-layout-projects',
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss']
})
export class LayoutProjectsComponent implements OnInit {
	@ViewChild('navigation') navigation: NavigationComponent;
	
	navItems: NavigationItem[];
	
	config;
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
		this.projectService.observeContentLoad()
			.subscribe(_ => {
				//console.log('LayoutProjectsComponent -> formatNavItemsBadge');
				this.navigation.formatNavItemsBadge();
			});
	}
}
