import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,
} from '@angular/router';

import { NotifierService } from 'angular-notifier';
 
import * as Rx from 'rxjs';

import { ProjectService } from 'app/data/project.service';
import { SecurityService } from 'app/security/security.service';

import { AuthSigninV2Component } from 'app/public/auth-signin-v2/auth-signin-v2.component';

@Injectable({
	providedIn: 'root'
})
export class ProjectGuard implements CanActivate {
	constructor(
		private router: Router,
		
		private notifier: NotifierService,
		
		private projectService: ProjectService,
		private securityService: SecurityService,
	) { }
	
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		//Rx.Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
		boolean
	{
		//console.log('ProjectGuard: ', next, next.params);
		
		let projectInRoute = next.params['project'] as string;
		if (projectInRoute != null && this.securityService.isValid()) {
			let expected = this.securityService.getProjectName().toLowerCase();
			//console.log(expected, projectInRoute);
			
			if (expected == projectInRoute.toLowerCase())
				return true;
		}
		
		AuthSigninV2Component.signInTo = projectInRoute;
		this.router.navigate(['login']);
		
		//this.notifier.notify('error', "Invalid credentials");
		return false;
	}
}
