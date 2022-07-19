import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm !: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    if(this.userService.isLoggedIn()) 
      this.router.navigateByUrl("/product");

    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8),
        Validators.maxLength(24),
      ]]
    });
    // this.signupForm.valueChanges.subscribe(console.log);
  }

  get fullNameControl() {
    return this.signupForm.get('fullName');
  }
  get emailControl() {
    return this.signupForm.get('email');
  }
  get passwordControl() {
    return this.signupForm.get('password');
  }

  onSubmit() {
    if(this.signupForm.valid) {
      this.userService.signupUser(this.signupForm.value).subscribe(
        (res : any) => {
          this.router.navigate(['/login'], {queryParams: {redirectedFrom: "register"}});
        },
        err => {
          console.error("Login error", err);
        }
      )
    }
    else {
      this.signupForm.markAllAsTouched();
    }
  }

}
