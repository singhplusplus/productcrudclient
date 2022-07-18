import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private userService: UserService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(!this.userService.isLoggedIn()) {
      this.userService.deleteToken();
      this.userService.deleteEmail();
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
  
}
