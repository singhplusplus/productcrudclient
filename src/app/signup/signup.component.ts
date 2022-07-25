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

  signupForm !: FormGroup;
  signupError : any;
  mustBeAdmin: boolean = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    // If there is an active session navigate to products page
    if(this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/product");
    }

    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8),
        Validators.maxLength(24),
      ]],
      role: ''
    });

    // Find if there is an Admin user in the system
    this.userService.getAdminProfile().subscribe({
      next: (res: any) => {
        if(!res || !res.success) {
          console.error(res.message);
          this.mustBeAdmin = true;
          this.signupForm.setValue({
            fullName: "Admin User",
            email: "user@admin.com",
            password: "",
            role: "Admin"
          });
        }
      },
      error: (err: any) => {
        console.error("No Admin user found", err);
        this.mustBeAdmin = true;
      },
    });
  }

  // getters for form controls
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
      this.isLoading = true;
      this.userService.signupUser(this.signupForm.value).subscribe({
        next: (res : any) => {
          this.isLoading = false;
          if(!res.success) {
            console.error("Signup error", res.message);
            this.signupError = res.message;
          }
          else {
            this.router.navigate(['/login'], {queryParams: {redirectedFrom: "signup"}});
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error("Signup error", err);
          this.signupError = "Sorry! Something went wrong";
        }
      })
    }
    else {
      this.signupForm.markAllAsTouched();
    }
  }

}
