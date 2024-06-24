import { Injectable } from '@angular/core';
import {
	ActivatedRoute, CanActivate, Router,
	ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from 'app/service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router, 
		private authService: AuthService,
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
		const project = next.paramMap.get('project');
		
		if (this.authService.isAuthenticated()) {
			// Must have any of the provided roles to be granted access
			const expectRoles = next.data['roles'] as string[];
			
			// No expectRoles = access ok as long as authenticated
			if (expectRoles.length == 0)
				return true;
			
			for (let role of expectRoles) {
				if (this.authService.hasRole(role))
					return true;
			}
		}
		
		console.log('AuthGuard', project);
		
		this.router.navigateByUrl(`/project/${project}/login`);
		return false;
	}
}
