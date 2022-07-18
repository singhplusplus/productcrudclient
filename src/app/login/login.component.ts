import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  fromComponent = "";

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
      email: '',
      password: ''
    });
    // this.loginForm.valueChanges.subscribe(console.log);
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.userService.login(this.loginForm.value).subscribe(
      (res : any) => {
        this.userService.setToken(res["token"]);
        this.userService.setEmail(this.loginForm.value.email);
        this.router.navigateByUrl("product");
      },
      err => {
        console.error("Login error", err);
      }
    )
  }
}
