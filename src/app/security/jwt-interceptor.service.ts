import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SecurityService } from './security.service';

@Injectable({
	providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
	
	constructor(private securityService: SecurityService) {
	}
	
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = this.securityService.getToken();
		//console.log('token', token);
		if (token) {
			// Add the bearer token to the HTTP request
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
				}
			});
		}
		return next.handle(req);
	}
}