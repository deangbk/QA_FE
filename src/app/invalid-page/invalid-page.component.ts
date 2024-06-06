// Angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { DataService, AuthService } from 'app/service';

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
		
		private authService: AuthService,
	) {
	
	}
	
	ngOnInit(): void {
		// Piece of shit Angular
		// (See app-routing.module.ts)
		this.router.navigate(['project']);
	}
}
