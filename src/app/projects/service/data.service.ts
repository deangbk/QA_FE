import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';

import { DataService, TOKEN, AuthService } from 'app/service';

// Provides auth token by reading from injected SecurityService
// Injected SecurityService should be ProjectAuthService

@Injectable()
export class ProjectDataService extends DataService {
	constructor(
		_http: HttpClient,
		private authService: AuthService
	) {
		super(_http);
		console.log('ProjectDataService');
	}
	
	override getContext(): HttpContext {
		let ctx = new HttpContext();
		
		const token = this.authService.getToken();
		if (token) {
			ctx.set(TOKEN, token);
		}
		
		return ctx;
	}
}
