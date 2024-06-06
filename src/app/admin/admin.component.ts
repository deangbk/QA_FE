import { Component, NgZone, OnInit } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { DattaConfig } from 'app/app-config';

import { DataService } from 'app/service';

import { NavigationItem } from 'app/shared/components/navigation/navigation';
import { NavigationPreset } from './navigation';

@Component({
	selector: 'app-layout-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {
	navItems: NavigationItem[];
	
	config;
	
	constructor(
		private zone: NgZone, private location: Location,
		private locationStrategy: LocationStrategy,
		private router: Router,
		
		private dataService: DataService,
	) {
		this.config = DattaConfig;
		
		
	}
	
	ngOnInit() {
		this.navItems = NavigationPreset.Admin;
	}
}
