import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../security/security.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot,UrlTree } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private securityService: SecurityService, private router: Router) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
		// Early return if authentication is invalid, redirect to login
		if (!this.securityService.isAuthenticated()) {
			this.router.navigate(['/login']);
			return false;
		}
		
		// Must have any of the provided roles to be granted access
		const expectRoles = next.data['roles'] as string[];
		//console.log(expectRoles, this.securityService.getTokenField('role'));
		
		for (let role of expectRoles) {
			if (this.securityService.hasRole(role))
				return true;
		}
		
		this.router.navigate(['/login']);
		return false;
	}
}
