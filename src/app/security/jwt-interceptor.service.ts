import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TOKEN } from '../data/data.service';

// Service that adds JWT bearer tokens to intercepted outbound requests

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
	constructor() {
	}
	
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (req.context.has(TOKEN)) {
			const token = req.context.get(TOKEN) as string;
			//console.log('JwtInterceptorService ctx token: ', token);
			
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
				}
			});
		}
		
		return next.handle(req);
	}
}