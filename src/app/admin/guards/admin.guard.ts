import { Injectable } from '@angular/core';
import {
	ActivatedRoute, CanActivate, Router,
	ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from 'app/service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(
		private router: Router, private route: ActivatedRoute, 
		private authService: AuthService,
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
		if (this.authService.isAuthenticated()) {
			if (this.authService.hasRole('admin'))
				return true;
		}
		
		this.router.navigateByUrl(`/admin/login`);
		return false;
	}
}
