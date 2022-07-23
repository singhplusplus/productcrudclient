import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router : Router, private userService : UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) : any {
    if (req.headers.get('noauth')) {
      return next.handle(req);
    }
    else {
      const clonedreq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${this.userService.getToken()}`)
      });
      return next.handle(clonedreq)
        .pipe(
          tap({
            error: (err: any) => {
              if(err.error.auth === false) {
                this.router.navigateByUrl('/login');
              }
            }
          })
        );
    }
  }
}