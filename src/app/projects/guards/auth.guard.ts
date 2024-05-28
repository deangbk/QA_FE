import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from 'app/security/security.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot,UrlTree } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router, private route: ActivatedRoute, 
		private securityService: SecurityService,
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
		const project = this.route.snapshot.paramMap.get('project');
		//console.log('AuthGuard: ', project, this.route);
		
		if (this.securityService.isAuthenticated()) {
			// Must have any of the provided roles to be granted access
			const expectRoles = next.data['roles'] as string[];
		
			for (let role of expectRoles) {
				if (this.securityService.hasRole(role))
					return true;
			}
		}
		
		console.log('AuthGuard', project);
		
		this.router.navigateByUrl(`/project/${project}/login`);
		return false;
	}
}
