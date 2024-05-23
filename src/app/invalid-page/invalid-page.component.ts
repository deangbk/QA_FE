// Angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-invalid-page',
	templateUrl: './invalid-page.component.html',
	styleUrls: ['./invalid-page.component.scss']
})
export class InvalidPageComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		
		private securityService: SecurityService,
	) {
	
	}
	
	ngOnInit(): void {
		// Piece of shit Angular
		// (See app-routing.module.ts)
		this.router.navigate(['project']);
	}
}
