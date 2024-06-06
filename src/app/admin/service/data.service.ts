import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';

import { DataService, TOKEN, AuthService } from 'app/service';

// Provides auth token by reading from injected SecurityService
// Injected SecurityService should be AdminAuthService

@Injectable()
export class AdminDataService extends DataService {
	constructor(
		_http: HttpClient,
		private authService: AuthService
	) {
		super(_http);
		console.log('AdminDataService');
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
