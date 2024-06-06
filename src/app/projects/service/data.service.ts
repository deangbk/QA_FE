import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';

import { DataService, TOKEN } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

// Provides auth token by reading from injected SecurityService
// Injected SecurityService should be ProjectSecurityService

@Injectable()
export class ProjectDataService extends DataService {
	constructor(
		_http: HttpClient,
		private securityService: SecurityService
	) {
		super(_http);
		console.log('ProjectDataService');
	}
	
	override getContext(): HttpContext {
		let ctx = new HttpContext();
		
		const token = this.securityService.getToken();
		if (token) {
			ctx.set(TOKEN, token);
		}
		
		return ctx;
	}
}
