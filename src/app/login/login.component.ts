import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  loginError: any;
  fromComponent = "";
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    if(this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/product");
    }

    // const redirectedFrom = this.activeRoute.snapshot.paramMap.get('redirectedFrom');
    this.activeRoute.queryParams.subscribe( params => {
      // console.log(params);
      const redirectedFrom = params['redirectedFrom'];
      if(redirectedFrom) {
        this.fromComponent = redirectedFrom;
      }
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8),
        Validators.maxLength(24),
      ]]
    });
    // this.loginForm.valueChanges.subscribe(console.log);
  }
  get emailControl() {
    return this.loginForm.get('email');
  }
  get passwordControl() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.fromComponent = "";
    if(this.loginForm.valid) {
      this.isLoading = true;
      this.userService.login(this.loginForm.value).subscribe({
        next: (res : any) => {
          this.isLoading = false;
          if(!res.success) {
            console.error("Login error", res.message);
            this.loginError = res.message;
          }
          else {
            this.userService.setToken(res["token"]);
            this.userService.setEmail(this.loginForm.value.email);
            this.router.navigateByUrl("product");
          }
        },
        error: err => {
          this.isLoading = false;
          console.error("Login error", err);
          this.loginError = "Sorry! Something went wrong";
        }
      })
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
