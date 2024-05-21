import { Component, NgZone, OnInit } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { DattaConfig } from 'app/app-config';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

@Component({
	selector: 'app-layout-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {
	config;
	
	constructor(
		private zone: NgZone, private location: Location,
		private locationStrategy: LocationStrategy,
		private router: Router,
		
		private dataService: DataService,
		private securityService: SecurityService,
	) {
		this.config = DattaConfig;
		
		
	}
	
	ngOnInit() {
		
	}
	
	
}
