import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from 'app/security/security.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot,UrlTree } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AdminGuard implements CanActivate {
	constructor(
		private router: Router, private route: ActivatedRoute, 
		private securityService: SecurityService,
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
		if (this.securityService.isAuthenticated()) {
			if (this.securityService.hasRole('admin'))
				return true;
		}
		
		this.router.navigateByUrl(`/admin/login`);
		return false;
	}
}
