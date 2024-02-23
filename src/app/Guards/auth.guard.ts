import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../security/security.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot,UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService:  SecurityService, private router: Router) {}

  canActivate(  next: ActivatedRouteSnapshot,state: RouterStateSnapshot) :Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
    const topLevel=this.authService.isManager()?'manager':'user';
    const routeRoles =next.data['roles'] as Array<string>;
    console.log("Top Level:"+topLevel);
    if (this.authService.isAuthenticated() && routeRoles.includes(topLevel)) {
      return true;
    } else {
      this.router.navigate(['/sign']);
      return false;
    }
  }
}
